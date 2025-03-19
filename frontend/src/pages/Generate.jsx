import React, { useState } from 'react';
import { ImagePlus, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import SpinnerLoader from '../utility/SpinnerLoader';
import { generateImage } from '../action/userAction';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export function Generate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState('/sessions_hero.png')
  const [loading, setLoading] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleGenerate = async(e) => {
    e.preventDefault();
    setLoading(true);
    
     const myForm = {
      prompt
    };

    try {
      const response = await dispatch(generateImage(myForm));
      
      if (response.success === true) {
          toast.success(response.message || "Image Generated Successfully!");
          setPrompt("")
          setIsImageLoaded(true)
          setImage(response.resultImage)
          setLoading(false); // Hide spinner after successful login
      } else {
        if(response.creditBalance === 0) {
          toast.error(response.message || "No credit");
          setLoading(false);
          navigate("/pricing");
        }
      }
    } catch (error) {
        toast.error('Image Generation failed!');
        setLoading(false); // Hide spinner after error
    }
  };

  const handleGenerateAnother = () => {
    setIsImageLoaded(false)
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center bg-gray-50 py-12">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Generate Image</h2>

        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Image Preview & Loading Animation */}
          <div className="relative flex flex-col items-center">
            {image ? (
              <img src={image} alt="Generated" className="max-w-sm rounded-md shadow-md" />
            ) : (
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md">
                <p className="text-gray-500">Your generated image will appear here</p>
              </div>
            )}

            {loading && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 animate-pulse" />
            )}
          </div>

          {/* Loading Text */}
          {loading && <p className="text-center text-gray-500">Generating image, please wait...</p>}

          {/* Prompt Input & Generate Button */}
          {!isImageLoaded && (
            <>
              <div className="relative flex items-center border border-gray-300 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-purple-500">
                <input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  type="text"
                  placeholder="Describe what you want to generate..."
                  className="w-full px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:ring-0"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !prompt}
                className={`w-full flex justify-center items-center px-4 py-3 text-lg font-medium text-white rounded-md transition ${
                  loading || !prompt
                    ? "bg-purple-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin h-5 w-5 mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ImagePlus className="h-5 w-5 mr-2" />
                    Generate Image
                  </>
                )}
              </button>
            </>
          )}

          {isImageLoaded && 
            <div className="flex justify-center gap-4 mt-6">
              <button onClick={handleGenerateAnother} className="px-6 py-2 text-white bg-gray-600 hover:bg-gray-700 rounded-md shadow transition" >
                Generate Another
              </button>

              <a href={image} download="generated-image.png" className="px-6 py-2 text-white bg-sky-500 hover:bg-sky-600 rounded-md shadow transition" >
                Download Image
              </a>
            </div>
          }

        </form>
      </div>
    </div>
  );
}