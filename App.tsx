import React, { useState, ChangeEvent } from 'react';
import { Upload, FileText, Briefcase, Download, Globe2, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from './components/Button';
import { Toaster, toast } from 'sonner';
import { pdfjs } from 'react-pdf';
import { EnhancementProgress } from './components/EnhancementProgress';
import { analyzeResume, ResumeAnalysis } from './lib/resumeEnhancements';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type Domain = 'software' | 'marketing' | 'finance' | 'healthcare';
type Template = 'modern' | 'classic' | 'minimal' | 'professional';

type Enhancement = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const enhancements: Enhancement[] = [
  {
    title: 'AI-Powered Optimization',
    description: 'Smart keyword matching with job requirements',
    icon: <Sparkles className="w-6 h-6 text-blue-500" />,
  },
  {
    title: 'Professional Templates',
    description: 'ATS-friendly resume formats',
    icon: <FileText className="w-6 h-6 text-blue-500" />,
  },
  {
    title: 'Industry-Specific',
    description: 'Tailored to your domain expertise',
    icon: <Briefcase className="w-6 h-6 text-blue-500" />,
  },
];

function App() {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [domain, setDomain] = useState<Domain>('software');
  const [template, setTemplate] = useState<Template>('modern');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [suggestionsReviewed, setSuggestionsReviewed] = useState(false);

  const handleResumeUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        if (file.size <= 5 * 1024 * 1024) { // 5MB limit
          setResume(file);
          setSuggestionsReviewed(false);
          setAnalysis(null);
          toast.success('Resume uploaded successfully');
        } else {
          toast.error('File size should be less than 5MB');
        }
      } else {
        toast.error('Please upload a PDF file');
      }
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume || !jobDescription) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);
    setSuggestionsReviewed(false);

    try {
      // Simulate file reading and analysis
      const reader = new FileReader();
      reader.onload = async () => {
        const resumeText = reader.result as string;
        const result = await analyzeResume(resumeText, jobDescription, domain);
        setAnalysis(result);
        setIsProcessing(false);
      };
      reader.readAsText(resume);
    } catch (error) {
      toast.error('Error analyzing resume');
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!suggestionsReviewed) {
      toast.error('Please review suggestions before downloading');
      return;
    }

    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Generating enhanced resume...',
        success: 'Enhanced resume downloaded successfully!',
        error: 'Failed to generate resume',
      }
    );
  };

  const handleReviewComplete = () => {
    setSuggestionsReviewed(true);
    toast.success('Suggestions reviewed! You can now download your enhanced resume.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Toaster position="top-center" />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Resume Enhancement
            </h1>
            <p className="text-lg text-gray-600">
              Upload your resume, provide job details, and let AI optimize your profile
            </p>
            <div className="flex items-center justify-center mt-2 text-blue-600">
              <Globe2 className="w-5 h-5 mr-2" />
              <span>Output in English</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {enhancements.map((enhancement, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  {enhancement.icon}
                  <h3 className="text-lg font-semibold ml-3">{enhancement.title}</h3>
                </div>
                <p className="text-gray-600">{enhancement.description}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleAnalyze} className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-8">
              <label className="block text-gray-700 text-lg font-semibold mb-4">
                Upload Resume (PDF)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeUpload}
                  className="hidden"
                  id="resume-upload"
                />
                <label
                  htmlFor="resume-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-12 h-12 text-blue-500 mb-4" />
                  <span className="text-gray-600">
                    {resume ? resume.name : 'Click to upload your resume (max 5MB)'}
                  </span>
                </label>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-gray-700 text-lg font-semibold mb-4">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Paste the job description here (in English)..."
              />
            </div>

            <div className="mb-8">
              <label className="block text-gray-700 text-lg font-semibold mb-4">
                Select Domain
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value as Domain)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="software">Software Development</option>
                <option value="marketing">Marketing</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
              </select>
            </div>

            <div className="mb-8">
              <label className="block text-gray-700 text-lg font-semibold mb-4">
                Choose Template
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['modern', 'classic', 'minimal', 'professional'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTemplate(t as Template)}
                    className={`p-4 border rounded-lg transition-all ${
                      template === t
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                  >
                    <FileText className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    <span className="block text-sm capitalize">{t}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={!resume || !jobDescription || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Analyze Resume
                  </>
                )}
              </Button>

              {analysis && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={handleReviewComplete}
                  disabled={suggestionsReviewed}
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  {suggestionsReviewed ? 'Suggestions Reviewed' : 'Mark Suggestions as Reviewed'}
                </Button>
              )}

              {analysis && suggestionsReviewed && (
                <Button
                  type="button"
                  className="w-full"
                  size="lg"
                  onClick={handleDownload}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Enhanced Resume (English)
                </Button>
              )}
            </div>

            <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
              <AlertCircle className="w-4 h-4 mr-2" />
              Maximum file size: 5MB
            </div>
          </form>

          <EnhancementProgress analysis={analysis} isProcessing={isProcessing} />
        </div>
      </div>
    </div>
  );
}

export default App;