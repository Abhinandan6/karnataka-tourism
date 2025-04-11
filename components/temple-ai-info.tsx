"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export function TempleAIInfo() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      setPreview(URL.createObjectURL(selectedImage));
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('usePredefined', 'true');

      // Add debugging information
      console.log('Submitting image:', image.name, 'Size:', image.size);
      
      const response = await fetch('/api/temple-info', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.error || 'Failed to process image');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error details:', err);
      setError('Error processing image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-amber-800 font-josefin">Temple AI Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Upload a temple image to get AI-generated information
            </p>
          </div>

          {preview && (
            <div className="mt-4">
              <img 
                src={preview} 
                alt="Preview" 
                className="max-h-64 rounded-md mx-auto"
              />
            </div>
          )}

          <Button 
            onClick={handleSubmit} 
            disabled={!image || loading}
            className="w-full bg-amber-600 hover:bg-amber-700"
          >
            {loading ? 'Analyzing...' : 'Analyze Temple Image'}
          </Button>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {result && (
            <div className="mt-6 space-y-4">
              <Separator />
              <div>
                <h3 className="font-medium text-amber-800">Description:</h3>
                <p className="text-gray-700">{result.caption}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-amber-800">Dynasty:</h3>
                  <p className="text-gray-700">{result.dynasty}</p>
                </div>
                <div>
                  <h3 className="font-medium text-amber-800">Era:</h3>
                  <p className="text-gray-700">{result.era}</p>
                </div>
                <div>
                  <h3 className="font-medium text-amber-800">Location:</h3>
                  <p className="text-gray-700">{result.location}</p>
                </div>
                <div>
                  <h3 className="font-medium text-amber-800">Style:</h3>
                  <p className="text-gray-700">{result.style}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}