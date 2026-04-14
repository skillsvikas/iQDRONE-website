// common-form.js – Universal handler for all iQdrone forms
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbynqlTF7C3KqIFA1iyzHZL921LkomOXKzcDD5Vm1Zb3a7oc2rXtnlJQiQSKGl60ibMK/exec";

async function submitForm(formElement, extraData = {}) {
  const formData = new FormData(formElement);
  
  let data = {
    formType: formElement.getAttribute("data-form-type") || "generic",
    name: formData.get("fullName") || formData.get("name") || "",
    email: formData.get("_replyto") || formData.get("email") || "",
    phone: formData.get("phone") || "",
    course: formData.get("course") || "",
    institution: formData.get("institution") || "",
    message: formData.get("message") || "",
    interest: formData.get("interest") || "",
    city: formData.get("city") || "",
    qualification: formData.get("qualification") || "",
    droneLicense: formData.get("droneLicense") || "",
    father: formData.get("father") || "",
    dob: formData.get("dob") || "",
    aadhar: formData.get("aadhar") || "",
    total: formData.get("total_amt") || "",
    paid: formData.get("paid_today") || "",
    due: formData.get("due") || "",
    payID: formData.get("payID") || "",
    start: formData.get("start") || "",
    finish: formData.get("finish") || ""
  };
  
  const pictureInput = formElement.querySelector("[name='pictureBase64']");
  if (pictureInput && pictureInput.value) {
    data.pictureBase64 = pictureInput.value;
  }
  
  const resumeFile = formData.get("resume");
  if (resumeFile && resumeFile.size > 0) {
    data.resumeBase64 = await fileToBase64(resumeFile);
    data.resumeFileName = resumeFile.name;
  }
  
  Object.assign(data, extraData);
  
  await fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("#courseEnrollForm, #droneLabForm, #contactForm, #partnerForm, #admissionForm, #founderForm");
  forms.forEach(form => {
    if (form.getAttribute("data-unified-bound")) return;
    form.setAttribute("data-unified-bound", "true");
    
    if (!form.getAttribute("data-form-type")) {
      const typeMap = {
        courseEnrollForm: "course-enrollment",
        droneLabForm: "drone-lab-inquiry",
        contactForm: "contact-us",
        partnerForm: "partner-inquiry",
        admissionForm: "admission",
        founderForm: "founder-enrollment"
      };
      const inferred = typeMap[form.id];
      if (inferred) form.setAttribute("data-form-type", inferred);
    }
    
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn?.innerText || "Submit";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = "Submitting...";
      }
      try {
        await submitForm(form);
        alert("✅ Submission successful!");
        form.reset();
        const pictureHidden = form.querySelector("[name='pictureBase64']");
        if (pictureHidden) pictureHidden.value = "";
      } catch (err) {
        console.error(err);
        alert("❌ Submission failed. Please try again.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalText;
        }
      }
    });
  });
});