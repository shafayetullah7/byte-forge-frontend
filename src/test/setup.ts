import '@testing-library/jest-dom';
import { cleanup } from '@solidjs/testing-library';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock i18n globally with proper translations for testing
vi.mock('~/i18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      // Return human-readable text for testing
      const translations: Record<string, string> = {
        // Verification labels
        'seller.verification.title': 'Shop Verification',
        'seller.verification.subtitle': 'Verify your business documents',
        'seller.verification.tradeLicenseNumber': 'Trade License Number',
        'seller.verification.tradeLicenseDocument': 'Trade License Document',
        'seller.verification.tinNumber': 'TIN Number',
        'seller.verification.tinDocument': 'TIN Document',
        'seller.verification.utilityBillDocument': 'Utility Bill Document',
        'seller.verification.tradeLicenseNumberDesc': 'Enter your trade license number',
        'seller.verification.optional': 'Optional',
        'seller.verification.existingDocuments': 'Existing Documents',
        'seller.verification.replaceDocumentsHint': 'Upload new documents to replace existing ones',
        'seller.verification.processInfoTitle': 'Verification Process',
        'seller.verification.processInfoText': 'Submit your documents for verification',
        'seller.verification.noChangesDetected': 'No changes detected. Please update at least one document or information before resubmitting.',
        'seller.verification.submitting': 'Submitting...',
        'seller.verification.resubmit': 'Resubmit',
        'seller.verification.submitVerificationBtn': 'Submit for Verification',
        'seller.verification.submittedSuccessfully': 'Submitted successfully',
        'seller.verification.submissionFailed': 'Submission failed',
        'seller.verification.loadingVerification': 'Loading verification data...',
        'seller.verification.noShopFound': 'No Shop Found',
        'seller.verification.noShopFoundDesc': 'Please create a shop before verifying',
        'seller.verification.createShopBtn': 'Create Shop',
        'seller.verification.resubmitDocumentsBtn': 'Resubmit Documents',
        'seller.verification.submitDocumentsBtn': 'Submit Documents',
        'seller.verification.verificationProcess': 'Verification Process',
        'seller.verification.step1Title': 'Submit Documents',
        'seller.verification.step1Desc': 'Upload your business documents',
        'seller.verification.step2Title': 'Admin Review',
        'seller.verification.step2Desc': 'Our team will review your documents',
        'seller.verification.step3Title': 'Approval',
        'seller.verification.step3Desc': 'Once approved, you can start selling',
        // Common labels
        'common.required': 'is required',
        'common.cancel': 'Cancel',
        'common.save': 'Save',
        'common.loading': 'Loading...',
        'common.error': 'Error',
        'common.success': 'Success',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock toast notifications globally
vi.mock('~/components/ui/Toast', () => ({
  toaster: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
  Toast: vi.fn(),
}));
