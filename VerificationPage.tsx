import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Camera, 
  CheckCircle, 
  XCircle, 
  Clock,
  Shield,
  CreditCard,
  Users,
  Eye
} from 'lucide-react';
import type { User, VerificationStatus } from '../App';

interface VerificationPageProps {
  user: User | null;
  onVerificationUpdate: (status: VerificationStatus) => void;
  onBack: () => void;
}

type VerificationStep = 'overview' | 'document-upload' | 'facial-recognition' | 'processing' | 'complete';

export function VerificationPage({ user, onVerificationUpdate, onBack }: VerificationPageProps) {
  const [currentStep, setCurrentStep] = useState<VerificationStep>('overview');
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [verificationResult, setVerificationResult] = useState<'success' | 'failed' | null>(null);

  const documentTypes = [
    { id: 'passport', label: 'Passport', icon: FileText },
    { id: 'license', label: 'Driving License', icon: CreditCard },
    { id: 'national-id', label: 'National ID', icon: Users }
  ];

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedDocument(file);
    }
  };

  const handleDocumentSubmit = () => {
    if (uploadedDocument && selectedDocumentType) {
      setCurrentStep('facial-recognition');
    }
  };

  const handleFacialRecognition = () => {
    setCurrentStep('processing');
    simulateProcessing();
  };

  const simulateProcessing = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setProcessingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        // Simulate random result for demo (90% success rate)
        const success = Math.random() > 0.1;
        setVerificationResult(success ? 'success' : 'failed');
        onVerificationUpdate(success ? 'verified' : 'rejected');
        setCurrentStep('complete');
      }
    }, 300);
  };

  const handleRetryVerification = () => {
    setCurrentStep('document-upload');
    setUploadedDocument(null);
    setSelectedDocumentType('');
    setProcessingProgress(0);
    setVerificationResult(null);
    onVerificationUpdate('not-started');
  };

  const getStatusBadge = (status?: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">✓ Verified</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">⏳ Pending Review</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="bg-red-100 text-red-800">✗ Verification Failed</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Verification</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Verify your identity to build trust with clients and access premium features. 
          The verification process takes just a few minutes.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current Status</CardTitle>
            {getStatusBadge(user?.verificationStatus)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-gray-500 mt-1" />
              <div>
                <h3 className="font-medium">Document Verification</h3>
                <p className="text-sm text-gray-600">Upload a government-issued ID</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Camera className="h-5 w-5 text-gray-500 mt-1" />
              <div>
                <h3 className="font-medium">Facial Recognition</h3>
                <p className="text-sm text-gray-600">Take a live selfie to match with your ID</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-gray-500 mt-1" />
              <div>
                <h3 className="font-medium">Instant Results</h3>
                <p className="text-sm text-gray-600">Get verified within minutes</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            {user?.verificationStatus === 'verified' ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Your profile is verified! You now have access to all platform features.
                </AlertDescription>
              </Alert>
            ) : user?.verificationStatus === 'rejected' ? (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  Verification failed. Please check your documents and try again.
                </AlertDescription>
              </Alert>
            ) : user?.verificationStatus === 'pending' ? (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Your verification is being reviewed. This usually takes 24-48 hours.
                </AlertDescription>
              </Alert>
            ) : (
              <Button 
                onClick={() => setCurrentStep('document-upload')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Start Verification Process
              </Button>
            )}

            {user?.verificationStatus === 'rejected' && (
              <Button 
                onClick={handleRetryVerification}
                variant="outline"
                className="w-full mt-3"
              >
                Retry Verification
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDocumentUpload = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload Your ID</h1>
        <p className="text-gray-600">
          Choose your document type and upload a clear photo of your government-issued ID
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Step 1: Document Upload</CardTitle>
          <CardDescription>Select your document type and upload a clear image</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Document Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {documentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedDocumentType(type.id)}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    selectedDocumentType === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <type.icon className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                  <div className="text-sm font-medium">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {selectedDocumentType && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Upload Document
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {uploadedDocument ? (
                  <div className="space-y-2">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
                    <p className="text-sm font-medium text-green-600">
                      {uploadedDocument.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      File uploaded successfully
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-600">
                      Drag and drop your document or click to browse
                    </p>
                    <p className="text-xs text-gray-500">
                      Supported formats: JPG, PNG, PDF (Max 10MB)
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleDocumentUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setCurrentStep('overview')}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleDocumentSubmit}
              disabled={!uploadedDocument || !selectedDocumentType}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Continue to Facial Recognition
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFacialRecognition = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <Camera className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Facial Recognition</h1>
        <p className="text-gray-600">
          Take a live selfie to verify your identity matches your uploaded document
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Step 2: Take a Selfie</CardTitle>
          <CardDescription>Position your face within the frame and take a clear photo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mock camera interface */}
          <div className="relative">
            <div className="aspect-square max-w-md mx-auto bg-gray-100 rounded-lg border-4 border-blue-500 border-dashed flex items-center justify-center">
              <div className="text-center">
                <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Camera Preview</p>
                <p className="text-sm text-gray-500 mt-2">
                  Position your face in the center
                </p>
              </div>
            </div>
            <div className="absolute inset-0 border-4 border-transparent">
              <div className="absolute inset-4 border-2 border-blue-500 rounded-full opacity-50"></div>
            </div>
          </div>

          <Alert>
            <Camera className="h-4 w-4" />
            <AlertDescription>
              Make sure your face is clearly visible and matches the photo on your uploaded document.
            </AlertDescription>
          </Alert>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setCurrentStep('document-upload')}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleFacialRecognition}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Camera className="h-4 w-4 mr-2" />
              Capture Photo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProcessing = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Verification</h1>
        <p className="text-gray-600">
          We're verifying your identity. This usually takes just a few moments.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Matching face with ID photo...</span>
                <span className="text-sm text-gray-500">{processingProgress}%</span>
              </div>
              <Progress value={processingProgress} className="h-2" />
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Document uploaded successfully</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Facial recognition completed</span>
              </div>
              <div className="flex items-center space-x-2">
                {processingProgress < 100 ? (
                  <Clock className="h-4 w-4 text-yellow-500" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
                <span>Verifying identity match</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderComplete = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        {verificationResult === 'success' ? (
          <>
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Complete!</h1>
            <p className="text-gray-600">
              Your identity has been successfully verified. You now have access to all platform features.
            </p>
          </>
        ) : (
          <>
            <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
            <p className="text-gray-600">
              We couldn't verify your identity. Please check your documents and try again.
            </p>
          </>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          {verificationResult === 'success' ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Congratulations!</strong> Your profile is now verified. You'll see a verification badge on your profile.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                Verification failed. Common issues: blurry photos, mismatched documents, or poor lighting. Please try again.
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-6 flex space-x-3">
            {verificationResult === 'failed' && (
              <Button
                onClick={handleRetryVerification}
                variant="outline"
                className="flex-1"
              >
                Try Again
              </Button>
            )}
            <Button
              onClick={onBack}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {verificationResult === 'success' ? 'Continue to Dashboard' : 'Back to Profile'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {currentStep === 'overview' && renderOverview()}
        {currentStep === 'document-upload' && renderDocumentUpload()}
        {currentStep === 'facial-recognition' && renderFacialRecognition()}
        {currentStep === 'processing' && renderProcessing()}
        {currentStep === 'complete' && renderComplete()}
      </div>
    </div>
  );
}