// backend/controllers/scanController.js
const fs = require('fs');
const { processReceipt } = require('../utils/ocrHelper');
const aiHelper = require('../utils/aiHelper');
const expenseModel = require('../models/expenseModel');

const hybridScan = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded.' });
  }
  const imagePath = req.file.path;

  try {
    // === Step 1: Perform OCR & Basic Validation ===
    const ocrResult = await processReceipt(imagePath);
    if (!ocrResult.success) {
      return res.status(400).json({ message: ocrResult.message });
    }
    const { amount, date, vendor } = ocrResult.data;

    // === Step 2: Calculate Confidence Score ===
    let confidenceScore = 0;
    const CONFIDENCE_THRESHOLD = 80; // We need a score of 80 out of 100 to auto-confirm

    if (amount) confidenceScore += 35;
    if (date) confidenceScore += 20;
    if (vendor && vendor.length < 25 && !vendor.match(/\d{3}-\d{3}-\d{4}/)) {
        // Give points for a vendor that seems reasonable (not too long, not a phone number)
        confidenceScore += 15;
    }
    
    // === Step 3: Predict Category and Add to Score ===
    const predictedCategory = await aiHelper.predictCategory(req.user.id, vendor);
    // Big confidence boost if we found a specific category (i.e., not 'Uncategorized')
    const uncategorizedId = await aiHelper.getUncategorizedId(req.user.id);
    if (predictedCategory && predictedCategory !== uncategorizedId) {
        confidenceScore += 30;
    }

    // === Step 4: Make the Final Decision ===
    const finalStatus = (confidenceScore >= CONFIDENCE_THRESHOLD) ? 'confirmed' : 'pending';
    const finalCategoryId = predictedCategory || uncategorizedId;
    
    // === Step 5: Create the Expense Record ===
    const newExpense = await expenseModel.create({
      userId: req.user.id,
      amount: amount || 0,
      date: date || new Date().toISOString().split('T')[0],
      vendor: vendor || 'Scanned Vendor',
      description: `Scanned expense (Confidence: ${confidenceScore})`,
      category_id: finalCategoryId,
      status: finalStatus // Use the decided status
    });

    // === Step 6: Send the Correct Response ===
    if (finalStatus === 'confirmed') {
      res.status(201).json({
        message: 'High confidence scan. Expense automatically saved!',
        status: 'confirmed',
        expense: newExpense
      });
    } else {
      res.status(202).json({ // 202 Accepted: request is accepted, but processing is not complete
        message: 'Low confidence scan. Please review and confirm.',
        status: 'pending',
        expense: newExpense
      });
    }

  } catch (error) {
    next(error);
  } finally {
    fs.unlink(imagePath, (err) => {
      if (err) console.error(`Failed to delete temp file: ${imagePath}`, err);
    });
  }
};

module.exports = { hybridScan };