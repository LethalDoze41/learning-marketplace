import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold mb-4">Welcome to Agora Learning Marketplace</h1>
        <p className="text-xl text-gray-600 mb-8">
          Connect with expert instructors and advance your skills
        </p>
        <Link 
          to="/explore" 
          className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-primary-700"
        >
          Explore Courses
        </Link>
      </section>
    </div>
  );
}

export default HomePage;