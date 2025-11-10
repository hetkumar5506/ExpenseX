// backend/utils/ocrHelper.js
const Tesseract = require('tesseract.js');
const chrono = require('chrono-node');
const nlp = require('compromise'); // We will now use this!

const RECEIPT_KEYWORDS = ['total', 'tax', 'subtotal', 'balance', 'amount', 'cash', 'credit', 'item', 'change', 'visa', 'mastercard'];

const parseAmount = (text) => {
    // This logic is already working well, so we'll keep it.
    const lines = text.toLowerCase().split('\n');
    let potentialAmounts = [];
    for (const line of lines) {
        if (RECEIPT_KEYWORDS.some(kw => line.includes(kw))) {
            const matches = line.match(/(\d{1,3}(?:,?\d{3})*(?:\.\d{2}))/);
            if (matches && matches[0]) {
                const amount = parseFloat(matches[0].replace(/,/g, ''));
                if (!isNaN(amount)) potentialAmounts.push(amount);
            }
        }
    }
    if (potentialAmounts.length > 0) return Math.max(...potentialAmounts);
    const allMatches = text.match(/(\d+\.\d{2})/g);
    if (!allMatches) return null;
    const numericalValues = allMatches.map(m => parseFloat(m)).filter(n => !isNaN(n));
    if (numericalValues.length === 0) return null;
    return Math.max(...numericalValues);
};

const parseDate = (text) => {
    const results = chrono.parse(text);
    return results.length ? results[0].start.date() : null;
};

// --- THIS IS THE MAJOR UPGRADE ---
const parseVendor = (text) => {
    // Take the first 5 lines of the receipt to analyze
    const topLines = text.split('\n').slice(0, 5).join('\n');
    const doc = nlp(topLines);

    // Ask compromise.js to find organizations
    let organizations = doc.organizations().out('array');

    if (organizations.length > 0) {
        // Return the first organization found. It's usually the vendor.
        console.log(`[NLP] Found Vendor (Organization): ${organizations[0]}`);
        return organizations[0];
    }

    // FALLBACK: If NLP finds nothing, use our old "first good line" logic
    console.log('[NLP] No organization found. Using fallback logic.');
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 2 && line.length < 30 && !line.match(/^\d/));
    return lines.length > 0 ? lines[0] : null;
};


const processReceipt = async (imagePath) => {
  try {
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
    
    const lowerCaseText = text.toLowerCase();
    const isLikelyReceipt = RECEIPT_KEYWORDS.some(keyword => lowerCaseText.includes(keyword));
    if (!isLikelyReceipt) {
      return { success: false, message: 'Image does not appear to be a receipt. Key words are missing.' };
    }

    const amount = parseAmount(text);
    const date = parseDate(text);
    const vendor = parseVendor(text); // Using our new and improved function

    if (amount === null || date === null) {
      return { success: false, message: 'Could not extract a valid amount and date.' };
    }
    
    return {
      success: true,
      data: { amount, date, vendor, rawText: text } // Pass rawText for controller logic
    };
  } catch (error) {
    console.error(`[OCR Error] ${error.message}`);
    return { success: false, message: 'Failed to process image with Tesseract.' };
  }
};

module.exports = { processReceipt };