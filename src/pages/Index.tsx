
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoginForm from '@/components/LoginForm';
import SignupForm from '@/components/SignupForm';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { isAuthenticated, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-md bg-primary p-2">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Claims Manager</h1>
          </div>
          <p className="text-muted-foreground text-center">
            The complete claims management solution for insurance agents
          </p>
        </div>
        
        <div className="flex justify-center mb-6">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={showLogin ? "default" : "outline"}
              onClick={() => setShowLogin(true)}
              className="w-full"
            >
              Login
            </Button>
            <Button
              variant={!showLogin ? "default" : "outline"}
              onClick={() => setShowLogin(false)}
              className="w-full"
            >
              Sign Up
            </Button>
          </div>
        </div>
        
        {showLogin ? <LoginForm /> : <SignupForm />}
      </div>
    </div>
  );
};

export default Index;
