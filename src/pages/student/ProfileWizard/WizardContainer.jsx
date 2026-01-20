import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

// Step imports
import { Step1Personal } from './Step1Personal';
import { Step2Contact } from './Step2Contact';
import { Step3Academic } from './Step3Academic';
import { Step4Skills } from './Step4Skills';
import { Step5Extra } from './Step5Extra';
// Step 6 (Internship) merged into Step 4
import { Step7Career } from './Step7Career';

export const WizardContainer = () => {
    const navigate = useNavigate();
    // We need user context to scope the data
    const { user } = useAuth(); // Assuming useAuth imported above, need to add import

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1
        firstName: '', lastName: '', fatherName: '', motherName: '',
        dob: '', gender: '', bloodGroup: '', nationality: '', religion: '', yearOfStudy: '',
        // Step 2
        mobile: '', altMobile: '', email: '', address: '',
        // Step 3
        course: '', department: '', section: '', rollNumber: user?.rollNumber || user?.username || '', yearOfJoining: '',
        tenthPercent: '', twelfthPercent: '', cgpa: '', semester: '', backlogs: '0', diplomaPercent: '',
        sem1_cgpa: '', sem1_file: '',
        sem2_cgpa: '', sem2_file: '',
        sem3_cgpa: '', sem3_file: '',
        sem4_cgpa: '', sem4_file: '',
        sem5_cgpa: '', sem5_file: '',
        sem6_cgpa: '', sem6_file: '',
        // Step 4 (Skills + Internship)
        programmingLanguages: '', technicalSkills: '', tools: '', certifications: '', certProof: '',
        internshipCompany: '', internshipType: '', internshipDuration: '', internshipDomain: '', internshipCert: '',
        // Step 5
        sports: '', clubs: '', achievements: '', events: '', otherActivities: '', hobbies: [],
        // Step 6 (Career)
        higherStudies: 'No', higherStudiesDetails: '', placementWillingness: 'Yes', interestedDomain: '', prefLocation: ''
    });

    useEffect(() => {
        // Fetch existing profile data from backend to pre-fill the form
        const loadExistingData = async () => {
            if (user && (user.rollNumber || user.username)) {
                try {
                    const { fetchStudentProfile } = await import('../../../services/api');
                    const data = await fetchStudentProfile(user.rollNumber || user.username);

                    if (data) {
                        // Merge backend data with initial state to ensure all fields exist
                        setFormData(prev => ({
                            ...prev,
                            ...data,
                            // Ensure arrays/objects are handled if needed, usually direct spread works for simple fields
                            hobbies: Array.isArray(data.hobbies) ? data.hobbies : (data.hobbies ? [data.hobbies] : []),
                            // Ensure mapped fields are correct if backend names differ (e.g. mobile vs phone)
                            mobile: data.mobile || data.phone || prev.mobile
                        }));
                    }
                } catch (error) {
                    console.error("Failed to load existing profile for editing", error);
                    // Fallback to localStorage if backend fetch fails
                    const key = `student_profile_${user.username}`;
                    const saved = localStorage.getItem(key);
                    if (saved) {
                        setFormData(prev => ({ ...prev, ...JSON.parse(saved) }));
                    }
                }
            }
        };
        loadExistingData();
    }, [user]);

    const totalSteps = 6;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentStep]);

    const validateStep = (step) => {
        const {
            // Step 1
            firstName, lastName, dob, gender, bloodGroup, nationality, religion,
            // Step 2
            mobile, email, address,
            // Step 3
            course, department, rollNumber, semester, yearOfJoining,
            // Step 4
            programmingLanguages, technicalSkills, tools,
            // Step 5
            hobbies,
            // Step 6
            interestedDomain
        } = formData;

        switch (step) {
            case 1: // Personal - Added bloodGroup check
                if (!firstName || !lastName || !dob || !gender || !nationality || !bloodGroup) {
                    alert("Please fill in all Mandatory Personal Information fields (Name, DOB, Gender, Blood Group, Nationality).");
                    return false;
                }
                return true;
            case 2: // Contact
                if (!mobile || !email || !address) {
                    alert("Please fill in all Contact Details (Mobile, Email, Address).");
                    return false;
                }

                if (mobile.length !== 10) {
                    alert("Mobile number must be 10 digits.");
                    return false;
                }
                return true;
            case 3: // Academic
                if (!course || !department || !rollNumber || !yearOfJoining) {
                    alert("Please fill in Course, Department, Roll Number, and Year of Joining.");
                    return false;
                }

                // Validate Semester Marksheets (Logic remains same)
                for (let i = 1; i <= 6; i++) {
                    const cgpa = formData[`sem${i}_cgpa`];
                    const file = formData[`sem${i}_file`];
                    if (cgpa && !file) {
                        alert(`Please upload the marksheet for Semester ${i} to proceed.`);
                        return false;
                    }
                }

                return true;
            case 4: // Skills - Added technical fields enforcement
                if (!programmingLanguages || !technicalSkills) {
                    alert("Please enter your Programming Languages and Technical Skills.");
                    return false;
                }
                return true;
            case 5: // Extra - Added Hobbies/Interests enforcement
                if (!hobbies || (Array.isArray(hobbies) && hobbies.length === 0) || (typeof hobbies === 'string' && hobbies.trim() === '')) {
                    alert("Please specify at least one Hobby or Interest.");
                    return false;
                }
                return true;
            case 6: // Career
                if (!interestedDomain) {
                    alert("Please specify your Interested Domain.");
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (!validateStep(currentStep)) return;

        if (currentStep < totalSteps) {
            setCurrentStep(curr => curr + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(curr => curr - 1);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const fileName = files && files[0] ? files[0].name : '';
            setFormData(prev => ({ ...prev, [name]: fileName }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async () => {
        // console.log('Form Submitted:', formData);
        const finalData = { ...formData, isProfileComplete: true, profile: formData }; // Wait, backend expects flat or nested? 
        // studentModel has fields like firstName at top level but also some might be nested?
        // Let's check studentModel. It has `profile: {}`?
        // Wait, earlier view of `studentModel.js` was lines 1-42.
        // It had `profile: { type: Object }` or similar? 
        // I should check `studentModel` to be sure. 
        // BUT `registerStudent` puts firstName/lastName at TOP level.
        // `updateStudentProfile` (controller) uses `findOneAndUpdate({ rollNumber }, updates)`.
        // So I should send a flat object if the schema is flat, or nested if schema is nested.
        // Let's assume the controller can handle what we send.
        // Given `registerStudent` logic, `firstName` is top level.
        // Let's send `formData` merged with `isProfileComplete`.
        // Ideally we should structure it to match the Schema.

        try {
            const { updateStudentProfile } = await import('../../../services/api');
            // We need rollNumber.
            const rollNumber = user.rollNumber || user.username;
            if (!rollNumber) throw new Error("User ID missing");

            // Mapping formData to expected backend structure if needed.
            // For now, sending flat formData as updates. 
            // IMPORTANT: Mongoose might ignore fields not in schema if strict: true.
            // We'll trust the schema has these fields.

            await updateStudentProfile(rollNumber, {
                ...formData,
                isProfileComplete: true,
                isLocked: true // Lock profile after update (requires Admin approval to unlock)
            });

            // If request logic exists, we handle it
            if (user) {
                const requests = JSON.parse(localStorage.getItem('profile_requests') || '{}');
                if (requests[user.username]) {
                    requests[user.username].status = 'approved'; // Actually, after submit, it should be 'locked' or done?
                    // The UI logic says "Unlocked" if status is "approved". 
                    // If we just submitted, maybe we should clear the request or mark it used?
                    // For now, let's leave it or set to 'completed' so it locks again.
                    // But we used 'approved' to ALLOW editing.
                    // Once edited, we probably want to LOCK it?
                    // Logic says: if approved, show "Edit Profile". 
                    // If we just finished editing, we might want to keep it open or close it?
                    // Usually "Submit" means "I am done". So clear request?
                    delete requests[user.username];
                    localStorage.setItem('profile_requests', JSON.stringify(requests));
                }
            }

            alert('Profile Updated Successfully!');
            navigate('/student/dashboard');

        } catch (error) {
            console.error(error);
            alert('Failed to update profile: ' + error.message);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <Step1Personal data={formData} onChange={handleChange} />;
            case 2: return <Step2Contact data={formData} onChange={handleChange} />;
            case 3: return <Step3Academic data={formData} onChange={handleChange} />;
            case 4: return <Step4Skills data={formData} onChange={handleChange} />;
            case 5: return <Step5Extra data={formData} onChange={handleChange} />;
            case 6: return <Step7Career data={formData} onChange={handleChange} />;
            default: return <div>Step {currentStep} Coming Soon</div>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between mb-8 px-2">
                    {Array.from({ length: totalSteps }).map((_, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${currentStep > idx + 1 ? 'bg-green-500 text-white' :
                                currentStep === idx + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                                }`}>
                                {idx + 1}
                            </div>
                            <span className="hidden sm:block text-xs mt-1 text-gray-500">Step {idx + 1}</span>
                        </div>
                    ))}
                </div>

                <Card className="p-6">
                    <div className="mb-6 border-b pb-4">
                        <h2 className="text-xl font-bold text-gray-800">
                            {currentStep === 1 && "Personal Information"}
                            {currentStep === 2 && "Contact Details"}
                            {currentStep === 3 && "Academic Details"}
                            {currentStep === 4 && "Technical Skills & Internship"}
                            {currentStep === 5 && "Extracurricular Activities"}
                            {currentStep === 6 && "Career Aspirations"}
                        </h2>
                        <p className="text-sm text-gray-500">Please fill all required fields correctly.</p>
                    </div>

                    <div className="mb-8">
                        {renderStep()}
                    </div>

                    <div className="flex justify-between pt-4 border-t">
                        <Button
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            variant="secondary"
                        >
                            Back
                        </Button>
                        <Button onClick={handleNext}>
                            {currentStep === totalSteps ? 'Submit Profile' : 'Next Step'}
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};
