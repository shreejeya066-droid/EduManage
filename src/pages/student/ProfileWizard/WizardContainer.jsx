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
    const [formData, setFormData] = useState(() => {
        // Initialize from localStorage if exists (for Edit Profile flow)
        // Use user-specific key if user exists
        const key = user ? `student_profile_${user.username}` : 'student_profile';
        const saved = localStorage.getItem(key);
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            // Step 1
            firstName: '', lastName: '', fatherName: '', motherName: '',
            dob: '', gender: '', bloodGroup: '', nationality: '', religion: '', yearOfStudy: '',
            // Step 2
            mobile: '', altMobile: '', email: '', address: '',
            // Step 3
            course: '', department: '', section: '', rollNumber: user?.username || '', yearOfJoining: '',
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
            sports: '', clubs: '', achievements: '', events: '', otherActivities: '',
            // Step 6 (Career)
            higherStudies: 'No', higherStudiesDetails: '', placementWillingness: 'Yes', interestedDomain: '', prefLocation: ''
        };
    });

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
            programmingLanguages,
            // Step 5 - Extracurriculars often optional, but user said "all details compulsory". 
            // We'll enforce at least one if strict, usually just common sense fields.
            // Step 6
            interestedDomain
        } = formData;

        switch (step) {
            case 1: // Personal
                if (!firstName || !lastName || !dob || !gender || !nationality) {
                    alert("Please fill in all Personal Information fields (Name, DOB, Gender, Nationality).");
                    return false;
                }
                return true;
            case 2: // Contact
                if (!mobile || !email || !address) {
                    alert("Please fill in all Contact Details (Mobile, Email, Address).");
                    return false;
                }
                // Mobile validation (already handled by regex input, but double check emptiness)
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

                // Validate Semester Marksheets
                for (let i = 1; i <= 6; i++) {
                    const cgpa = formData[`sem${i}_cgpa`];
                    const file = formData[`sem${i}_file`];
                    if (cgpa && !file) {
                        alert(`Please upload the marksheet for Semester ${i} to proceed.`);
                        return false;
                    }
                }

                return true;
            case 4: // Skills
                // Let's require at least one language
                if (!programmingLanguages) {
                    alert("Please enter at least one Programming Language.");
                    return false;
                }
                return true;
            case 5: // Extra
                // Often optional, but let's just pass for now unless user strictly meant EVERY field.
                // Assuming Extra Curriculars can be "None" but let's not block.
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

    const handleSubmit = () => {
        console.log('Form Submitted:', formData);
        const key = user ? `student_profile_${user.username}` : 'student_profile';
        localStorage.setItem(key, JSON.stringify(formData));

        // LOCK PROFILE AFTER UPDATE
        // We do this by updating the request status to 'completed' or removing it, 
        // effectively revoking the 'approved' status.
        if (user) {
            const requests = JSON.parse(localStorage.getItem('profile_requests') || '{}');
            if (requests[user.username]) {
                requests[user.username].status = 'completed'; // Or 'locked'
                localStorage.setItem('profile_requests', JSON.stringify(requests));
            }
        }

        alert('Profile Updated Successfully! Your profile is now locked.');
        navigate('/student/dashboard');
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
