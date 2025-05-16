
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface Step {
  element: string;
  title: string;
  intro: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const IntroGuide: React.FC = () => {
  const [showIntro, setShowIntro] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    // Check if this is the first visit
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');
    if (!hasSeenIntro) {
      // Wait for the DOM to fully load
      setTimeout(() => {
        setShowIntro(true);
      }, 1000);
    }

    // Set up the tour steps
    setSteps([
      {
        element: '#dashboard-overview',
        title: 'Dashboard',
        intro: 'Welcome to your claims dashboard! This is where you\'ll see key statistics and recent claims.',
        position: 'bottom'
      },
      {
        element: '#claims-navigation',
        title: 'Claims',
        intro: 'Click here to view and manage all claims in the system.',
        position: 'right'
      },
      {
        element: '#claims-stats',
        title: 'Claims Statistics',
        intro: 'Here you can see the status of all claims at a glance.',
        position: 'bottom'
      },
      {
        element: '#recent-claims',
        title: 'Recent Claims',
        intro: 'These are your most recently updated claims for quick access.',
        position: 'top'
      }
    ]);
  }, []);

  const startTour = () => {
    setCurrentStep(0);
    setShowIntro(true);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      endTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const endTour = () => {
    setShowIntro(false);
    localStorage.setItem('hasSeenIntro', 'true');
    toast('Tour completed! You can restart the tour anytime from the help menu.');
  };

  const resetTutorial = () => {
    localStorage.removeItem('hasSeenIntro');
    toast.success('Tutorial reset! It will appear on your next login.');
  };

  if (!showIntro) return (
    <div className="fixed bottom-5 right-5 z-50">
      <Button variant="outline" onClick={startTour}>
        Show Guide
      </Button>
    </div>
  );
  
  const currentStepData = steps[currentStep];

  return (
    <Dialog open={showIntro} onOpenChange={setShowIntro}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{currentStepData?.title || 'Welcome Tour'}</DialogTitle>
          <DialogDescription>
            {currentStepData?.intro || 'Let\'s take a quick tour of the application!'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between items-center pt-4">
          <div>
            Step {currentStep + 1} of {steps.length}
          </div>
          <Button variant="ghost" size="icon" onClick={endTour} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button onClick={nextStep}>
            {currentStep < steps.length - 1 ? 'Next' : 'Finish'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IntroGuide;
