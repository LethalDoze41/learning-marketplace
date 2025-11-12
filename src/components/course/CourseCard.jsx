import { Link } from 'react-router-dom';

function CourseCard({ course }) {
  return (
    <Link to={`/course/${course.id}`} className="block">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200">
        <div className="relative">
          <img
            src={course.thumbnail || 'https://via.placeholder.com/400x200'}
            alt={course.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          {course.badge && (
            <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
              {course.badge}
            </span>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{course.instructorName}</p>
          
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              <span className="text-sm font-semibold text-yellow-500 mr-1">
                {course.rating?.toFixed(1) || '0.0'}
              </span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(course.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">
                ({course.reviewCount || 0})
              </span>
            </div>
          </div>
          
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {course.duration || 0} hours
            <span className="mx-2">•</span>
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            {course.level}
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-gray-900">${course.price}</span>
              {course.originalPrice && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  ${course.originalPrice}
                </span>
              )}
            </div>
            {course.enrollmentCount > 0 && (
              <span className="text-xs text-gray-500">
                {course.enrollmentCount} enrolled
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CourseCard;