import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

export function RegisterHomeownerPage() {
  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    email: "",
    phone: "",
    coApplicant: "",
    propertyAddress: "",
    lotUnit: "",
    ownership: "Owner",
    previousAddress: "",
    emergencyName: "",
    emergencyPhone: "",
    vehicles: "",
    vehicleDescriptions: "",
    householdMembers: "",
    password: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();

    const required = [
      "fullName",
      "email",
      "phone",
      "propertyAddress",
      "lotUnit",
      "ownership",
      "emergencyName",
      "emergencyPhone",
      "password",
    ];

    if (required.some((field) => !form[field as keyof typeof form].trim())) {
      setError("Please complete all required fields before submitting.");
      return;
    }

    setError("");
    setSubmitted(true);
  }

  return (
    <div className="shell homeowner-shell">
      <aside className="panel">
        <p className="mark">AIQMX</p>
        <div>
          <p className="kicker">Homeowner registration</p>
          <h1>Tell us about your home.</h1>
          <p className="lede">
            Create your homeowner account and share the property details we
            need to connect you with the right real-estate services.
          </p>
        </div>
      </aside>

      <main className="form-side homeowner-form-side">
        {submitted ? (
          <div className="success-wrap">
            <Link className="login-back" to="/signup">
              ← AIQMX
            </Link>
            <p className="kicker">Application received</p>
            <h2>Pending approval</h2>
            <p className="pending">
              <strong>Thanks, {form.fullName || "there"}.</strong>
              Your homeowner registration has been submitted and is pending
              approval. We'll email {form.email || "you"} once your application
              has been reviewed.
            </p>
            <Link className="login-back" to="/login">
              Back to log in
            </Link>
          </div>
        ) : (
          <form className="homeowner-form" onSubmit={onSubmit} noValidate>
            <Link className="login-back" to="/signup">
              ← AIQMX
            </Link>

            <p className="kicker">Homeowner</p>
            <h2>Create your account</h2>
            <p className="form-intro">
              Complete the application below. Fields marked with * are
              required.
            </p>
            <section className="form-section">
              <div className="section-heading">
                <span>1</span>
                <div>
                  <h3>Applicant details</h3>
                  <p>Your contact information</p>
                </div>
              </div>

              <label htmlFor="fullName">Full name *</label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                required
              />

              <div className="form-grid">
                <div>
                  <label htmlFor="dob">Date of birth</label>
                  <input
                    id="dob"
                    type="date"
                    value={form.dob}
                    onChange={(e) => update("dob", e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="phone">Phone number *</label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    required
                  />
                </div>
              </div>

              <label htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
              />

              <label htmlFor="coApplicant">Spouse / co-applicant full name</label>
              <input
                id="coApplicant"
                type="text"
                value={form.coApplicant}
                onChange={(e) => update("coApplicant", e.target.value)}
              />
            </section>

            <section className="form-section">
              <div className="section-heading">
                <span>2</span>
                <div>
                  <h3>Property & residency</h3>
                  <p>Information about your home</p>
                </div>
              </div>

              <label htmlFor="propertyAddress">Property address *</label>
              <textarea
                id="propertyAddress"
                rows={3}
                value={form.propertyAddress}
                onChange={(e) => update("propertyAddress", e.target.value)}
                required
              />

              <div className="form-grid">
                <div>
                  <label htmlFor="lotUnit">Lot / unit number *</label>
                  <input
                    id="lotUnit"
                    type="text"
                    value={form.lotUnit}
                    onChange={(e) => update("lotUnit", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="ownership">Ownership / residency *</label>
                  <select
                    id="ownership"
                    value={form.ownership}
                    onChange={(e) => update("ownership", e.target.value)}
                    required
                  >
                    <option>Owner</option>
                    <option>Renter</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <label htmlFor="previousAddress">Previous address</label>
              <textarea
                id="previousAddress"
                rows={2}
                value={form.previousAddress}
                onChange={(e) => update("previousAddress", e.target.value)}
              />
            </section>

            <section className="form-section">
              <div className="section-heading">
                <span>3</span>
                <div>
                  <h3>Emergency contact</h3>
                  <p>Someone we can contact if needed</p>
                </div>
              </div>

              <div className="form-grid">
                <div>
                  <label htmlFor="emergencyName">Full name *</label>
                  <input
                    id="emergencyName"
                    type="text"
                    value={form.emergencyName}
                    onChange={(e) => update("emergencyName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="emergencyPhone">Phone number *</label>
                  <input
                    id="emergencyPhone"
                    type="tel"
                    value={form.emergencyPhone}
                    onChange={(e) => update("emergencyPhone", e.target.value)}
                    required
                  />
                </div>
              </div>
            </section>

            <section className="form-section">
              <div className="section-heading">
                <span>4</span>
                <div>
                  <h3>Household & vehicles</h3>
                  <p>Optional community details</p>
                </div>
              </div>

              <label htmlFor="householdMembers">Household members</label>
              <textarea
                id="householdMembers"
                rows={3}
                placeholder="Names or number of household members"
                value={form.householdMembers}
                onChange={(e) => update("householdMembers", e.target.value)}
              />

              <div className="form-grid">
                <div>
                  <label htmlFor="vehicles">Number of vehicles</label>
                  <input
                    id="vehicles"
                    type="number"
                    min="0"
                    value={form.vehicles}
                    onChange={(e) => update("vehicles", e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="vehicleDescriptions">Vehicle descriptions</label>
                  <input
                    id="vehicleDescriptions"
                    type="text"
                    placeholder="Make, model, color..."
                    value={form.vehicleDescriptions}
                    onChange={(e) =>
                      update("vehicleDescriptions", e.target.value)
                    }
                  />
                </div>
              </div>
            </section>

            <section className="form-section">
              <div className="section-heading">
                <span>5</span>
                <div>
                  <h3>Account security</h3>
                  <p>Protect your AIQMX account</p>
                </div>
              </div>

              <label htmlFor="password">Password *</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                required
              />

              <label className="consent-row">
                <input type="checkbox" required />
                <span>
                  I confirm that the information provided is accurate and I
                  agree to the AIQMX registration terms.
                </span>
              </label>
            </section>

            {error ? <p className="error">{error}</p> : null}

            <button type="submit">Submit</button>

            <p className="signup-link">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </form>
        )}
      </main>
    </div>
  )
}
