import { Link } from 'react-router-dom';

function EnrolledCourseCard({ enrollment }) {
  const { course, progress = 0, lastAccessedAt } = enrollment;
  
  if (!course) {
    return null;
  }

  const progressPercentage = Math.min(100, Math.max(0, progress));
  
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200">
      <Link to={`/course/${enrollment.courseId}/learn`}>
        <div className="relative">
          <img
            src={course.thumbnail || 'https://via.placeholder.com/400x200'}
            alt={course.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          {progressPercentage === 100 && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              COMPLETED
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/course/${enrollment.courseId}/learn`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-primary-600 line-clamp-2">
            {course.title}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 mb-3">{course.instructorName}</p>
        
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        
        {/* Last Accessed */}
        {lastAccessedAt && (
          <p className="text-xs text-gray-500 mb-3">
            Last accessed: {new Date(lastAccessedAt).toLocaleDateString()}
          </p>
        )}
        
        {/* Action Button */}
        <Link
          to={`/course/${enrollment.courseId}/learn`}
          className="w-full block text-center bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          {progressPercentage === 0 
            ? 'Start Course' 
            : progressPercentage === 100 
            ? 'Review Course' 
            : 'Continue Learning'}
        </Link>
        
        {/* Certificate Button for Completed Courses */}
        {progressPercentage === 100 && (
          <button
            onClick={(e) => {
              e.preventDefault();
              alert('Certificate download feature coming soon!');
            }}
            className="w-full mt-2 block text-center border border-primary-600 text-primary-600 py-2 rounded-lg hover:bg-primary-50 transition-colors"
          >
            Download Certificate
          </button>
        )}
      </div>
    </div>
  );
}

export default EnrolledCourseCard;