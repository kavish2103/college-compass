export default function Footer() {
  return (
    <footer className="w-full border-t bg-gray-50 py-6">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:text-left sm:px-6 lg:px-8">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} CollegeCompass. All rights reserved. Built for internship evaluation.
        </p>
        <div className="flex gap-4 text-sm text-gray-400">
          <a href="#" className="hover:text-gray-600">Privacy Policy</a>
          <span>&middot;</span>
          <a href="#" className="hover:text-gray-600">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
