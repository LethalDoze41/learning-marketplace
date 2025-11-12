function LearningProgress({ progress, totalLessons, completedLessons }) {
    const progressPercentage = Math.min(100, Math.max(0, progress || 0));
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Your Progress</h3>
        
        {/* Circular Progress */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - progressPercentage / 100)}`}
                className="text-primary-600 transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold">{progressPercentage}%</span>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Completed Lessons</span>
            <span className="font-semibold">{completedLessons || 0} / {totalLessons || 0}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Time Spent</span>
            <span className="font-semibold">12h 34m</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Estimated Time Left</span>
            <span className="font-semibold">3h 26m</span>
          </div>
        </div>
        
        {/* Motivational Message */}
        {progressPercentage > 0 && progressPercentage < 100 && (
          <div className="mt-4 p-3 bg-primary-50 rounded-lg">
            <p className="text-sm text-primary-700">
              {progressPercentage < 25 && "Great start! Keep up the momentum!"}
              {progressPercentage >= 25 && progressPercentage < 50 && "You're making excellent progress!"}
              {progressPercentage >= 50 && progressPercentage < 75 && "Halfway there! You're doing amazing!"}
              {progressPercentage >= 75 && progressPercentage < 100 && "Almost finished! Final push!"}
            </p>
          </div>
        )}
        
        {progressPercentage === 100 && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700 font-semibold">
              🎉 Congratulations! You've completed this course!
            </p>
          </div>
        )}
      </div>
    );
  }
  
  export default LearningProgress;