import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';

function CourseDetailPage() {
  const { courseId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  useEffect(() => {
    if (currentUser && course) {
      checkEnrollmentStatus();
    }
  }, [currentUser, course]);

  const fetchCourseDetails = async () => {
    try {
      // Fetch course
      const courseDoc = await getDoc(doc(db, 'courses', courseId));
      if (!courseDoc.exists()) {
        navigate('/explore');
        return;
      }
      
      const courseData = { id: courseDoc.id, ...courseDoc.data() };
      setCourse(courseData);

      // Fetch instructor
      const instructorDoc = await getDoc(doc(db, 'users', courseData.instructorId));
      if (instructorDoc.exists()) {
        setInstructor({ id: instructorDoc.id, ...instructorDoc.data() });
      }

      // Fetch reviews
      const reviewsQuery = query(
        collection(db, 'reviews'),
        where('courseId', '==', courseId)
      );
      const reviewsSnapshot = await getDocs(reviewsQuery);
      const reviewsData = reviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching course details:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
    try {
      const enrollmentQuery = query(
        collection(db, 'enrollments'),
        where('courseId', '==', courseId),
        where('studentId', '==', currentUser.uid)
      );
      const enrollmentSnapshot = await getDocs(enrollmentQuery);
      setIsEnrolled(!enrollmentSnapshot.empty);
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnroll = async () => {
    if (!currentUser) {
      navigate('/login', { state: { from: location } });
      return;
    }

    setEnrolling(true);
    try {
      // Create enrollment record
      await addDoc(collection(db, 'enrollments'), {
        courseId: courseId,
        studentId: currentUser.uid,
        instructorId: course.instructorId,
        enrolledAt: new Date().toISOString(),
        progress: 0,
        completedLessons: [],
        lastAccessedAt: new Date().toISOString()
      });

      setIsEnrolled(true);
      // Redirect to course content or payment page
      navigate(`/course/${courseId}/learn`);
    } catch (error) {
      console.error('Error enrolling in course:', error);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <nav className="text-sm mb-4">
                <a href="/explore" className="text-gray-400 hover:text-white">Courses</a>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-400">{course.category}</span>
              </nav>
              
              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              <p className="text-gray-300 text-lg mb-4">{course.description}</p>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(course.rating || 0) ? 'text-yellow-400' : 'text-gray-600'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-white">
                    {course.rating?.toFixed(1) || 'N/A'} ({reviews.length} reviews)
                  </span>
                </div>
                <span className="text-gray-400">•</span>
                <span>{course.enrollmentCount || 0} students</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">Created by {instructor?.displayName || 'Instructor'}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-300">Last updated {new Date(course.updatedAt).toLocaleDateString()}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-300">{course.language || 'English'}</span>
              </div>
            </div>
            
            {/* Course Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 text-gray-900">
                <div className="mb-4">
                  <img
                    src={course.thumbnail || 'https://via.placeholder.com/400x200'}
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                
                <div className="mb-6">
                  <div className="text-3xl font-bold mb-2">${course.price}</div>
                  {course.originalPrice && (
                    <div className="text-gray-500 line-through">${course.originalPrice}</div>
                  )}
                </div>
                
                {isEnrolled ? (
                  <button
                    onClick={() => navigate(`/course/${courseId}/learn`)}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium"
                  >
                    Continue Learning
                  </button>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 font-medium disabled:opacity-50"
                  >
                    {enrolling ? 'Processing...' : 'Enroll Now'}
                  </button>
                )}
                
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {course.duration} hours of content
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Certificate of completion
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    {course.level} level
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* What you'll learn */}
            <section className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.objectives?.map((objective, index) => (
                  <div key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{objective}</span>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Course Content */}
            <section className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Course Content</h2>
              <div className="space-y-2">
                {course.modules?.map((module, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg">
                    <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <span className="font-medium">{module.title}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {module.lessons?.length || 0} lessons • {module.duration || 0} min
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Requirements */}
            <section className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {course.requirements?.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </section>
            
            {/* Reviews */}
            <section className="bg-white rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Student Reviews</h2>
              {reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      <p className="text-sm text-gray-500 mt-2">- {review.studentName}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
          
          {/* Instructor Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-4">Instructor</h3>
              {instructor && (
                <div>
                  <div className="flex items-center mb-4">
                    <img
                      src={instructor.photoURL || 'https://via.placeholder.com/100'}
                      alt={instructor.displayName}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <h4 className="font-semibold">{instructor.displayName}</h4>
                      <p className="text-sm text-gray-500">{instructor.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-4">{instructor.bio}</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      {instructor.teachingCourses?.length || 0} Courses
                    </div>
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      {instructor.totalStudents || 0} Students
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailPage;