export const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full px-4 py-2 pt-4 text-sm text-center text-gray-700 shadow bg-gray-50">
      © {new Date().getFullYear()} AI Image Studio. All rights reserved.{" "}
      <a
        href="https://thecodechaser.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        thecodechaser.com
      </a>
    </footer>
  );
};
