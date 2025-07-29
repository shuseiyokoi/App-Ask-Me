import React from "react";
import { Link } from "react-router-dom";

const TermsOfUse = () => {
    return (
        <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "800px", margin: "auto" }}>
            <h1>Terms of Use</h1>
            <p>Last updated: March 3, 2025</p>
            <p>Welcome to Ask Me Bot! By using our service, you agree to the following terms</p>
            
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing this application, you agree to be bound by these Terms of Use.</p>

            <h2>2. Usage Restrictions</h2>
            <p>You agree not to misuse this application in any way.</p>

            <h2>3. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time.</p>

            <Link to="/" style={{ color: "#007bff", textDecoration: "none" }}>Back to Home</Link>
        </div>
    );
};

export default TermsOfUse;
