import "../../index.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-icons">
        <a href="#"><i className="fab fa-github"></i></a>
        <a href="#"><i className="fab fa-linkedin"></i></a>
        <a href="#"><i className="fab fa-instagram"></i></a>
        <a href="#"><i className="fab fa-twitter"></i></a>
      </div>

      <p className="footer-text">
        © 2025 <span>Akash Sonawale</span>. All Rights Reserved
      </p>

    </footer>
  );
}
