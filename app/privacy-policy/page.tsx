import Link from "next/link"

export const metadata = {
  title: "Privacy Policy - Organic Store",
  description: "Our privacy policy and how we protect your data.",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <Link href="/" className="text-primary hover:underline">
            Home
          </Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="text-foreground">Privacy Policy</span>
        </nav>

        <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: December 17, 2025</p>

        <div className="space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
            <p>
              Organic Store ("we", "our", or "us") operates the organicbazaar.online website. This page informs you of our
              policies regarding the collection, use, and disclosure of personal data when you use our Service and the
              choices you have associated with that data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Information Collection and Use</h2>
            <p className="mb-4">We collect several different types of information for various purposes:</p>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Personal Data</h3>
                <p>
                  When placing an order, we collect: name, email address, phone number, shipping address, billing
                  address, and payment information.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Usage Data</h3>
                <p>
                  We automatically collect certain information about how you access and use the Service, including IP
                  address, browser type, pages visited, and the time and date of your visit.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Cookies</h3>
                <p>
                  We use cookies to enhance your experience. You can instruct your browser to refuse all cookies or to
                  indicate when a cookie is being sent.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Use of Data</h2>
            <p>We use the collected data for various purposes:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li>To provide and maintain our Service</li>
              <li>To process and fulfill your orders</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information to improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Security of Data</h2>
            <p>
              The security of your data is important to us but remember that no method of transmission over the Internet
              or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to
              protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date at the top of this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at jawadiqbal962@gmail.com or call
              1-800-ORG-GOOD.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}

