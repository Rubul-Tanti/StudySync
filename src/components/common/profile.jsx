import { useState } from "react";
import { FiEdit2, FiSave, FiX, FiCamera, FiMail, FiPhone, FiMapPin, FiCalendar, FiUser, FiGlobe, FiAward, FiBookOpen, FiStar } from "react-icons/fi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../loader";

// Mock user data - replace with your actual data from Redux/API
const mockTeacherData = {
  role: "teacher",
  personalDetails: {
    name: "Ahmed Ibrahim",
    email: "ahmed.ibrahim@example.com",
    phone: "+1234567890",
    gender: "Male",
    dob: "1990-05-15",
    country: "Egypt",
    profilePic: "https://res.cloudinary.com/dtndjkokp/image/upload/v1761327695/defaultprofile_jlq8ct.png",
    languageSpoken: ["Arabic", "English", "Urdu"]
  },
  profesnalDetails: {
    professionalEmail: "ahmed.teacher@example.com",
    monthlyRate: "500",
    certificates: ["Tajweed Certificate", "Quranic Studies Degree"],
    educationDetails: "Masters in Islamic Studies from Al-Azhar University",
    bio: "Experienced Quran teacher with 10+ years of teaching experience. Specialized in Tajweed and Quranic Arabic.",
    specializations: ["Tajweed", "Quranic Arabic", "Memorization"]
  },
  rating: 4.8,
  verified: true,
  online: true
};

const mockStudentData = {
  role: "student",
  personalDetails: {
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1987654321",
    gender: "Female",
    dob: "2005-08-20",
    country: "United States",
    profileImage: "https://cdn.vectorstock.com/i/500p/11/28/profile-icon-male-avatar-user-circles-vector-50791128.avif"
  },
  StudySyncCourse: [
    {
      courseName: "Beginner Quran Reading",
      courseDescription: "Learn to read Quran with proper pronunciation",
      courseDuration: "3 months"
    }
  ]
};

const Profile = () => {
  const user=useSelector((state)=>state.auth.user)
  const userRole=user?.role
  const isLoading=useSelector((state)=>state.auth.loading)
  const initialData = userRole === "teacher" ? mockTeacherData : mockStudentData;
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(initialData);
  const [editedData, setEditedData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(userData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(userData);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // TODO: Add API call to update profile
      // await api.put('/v1/update-profile', editedData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUserData(editedData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
      setLoading(false);
    } catch (error) {
      toast.error("Failed to update profile");
      setLoading(false);
    }
  };

  const handleInputChange = (field, value, isNested = false, nestedField = null) => {
    if (isNested && nestedField) {
      setEditedData(prev => ({
        ...prev,
        [nestedField]: {
          ...prev[nestedField],
          [field]: value
        }
      }));
    } else {
      setEditedData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleArrayChange = (field, index, value, nestedField = null) => {
    const fieldPath = nestedField ? editedData[nestedField][field] : editedData[field];
    const newArray = [...fieldPath];
    newArray[index] = value;
    
    if (nestedField) {
      setEditedData(prev => ({
        ...prev,
        [nestedField]: {
          ...prev[nestedField],
          [field]: newArray
        }
      }));
    } else {
      setEditedData(prev => ({
        ...prev,
        [field]: newArray
      }));
    }
  };

  const handleArrayAdd = (field, nestedField = null) => {
    const fieldPath = nestedField ? editedData[nestedField][field] : editedData[field];
    const newArray = [...fieldPath, ""];
    
    if (nestedField) {
      setEditedData(prev => ({
        ...prev,
        [nestedField]: {
          ...prev[nestedField],
          [field]: newArray
        }
      }));
    } else {
      setEditedData(prev => ({
        ...prev,
        [field]: newArray
      }));
    }
  };

  const handleArrayRemove = (field, index, nestedField = null) => {
    const fieldPath = nestedField ? editedData[nestedField][field] : editedData[field];
    const newArray = fieldPath.filter((_, i) => i !== index);
    
    if (nestedField) {
      setEditedData(prev => ({
        ...prev,
        [nestedField]: {
          ...prev[nestedField],
          [field]: newArray
        }
      }));
    } else {
      setEditedData(prev => ({
        ...prev,
        [field]: newArray
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // TODO: Upload to cloudinary or your storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageField = userRole === "teacher" ? "profilePic" : "profileImage";
        handleInputChange(imageField, reader.result, true, "personalDetails");
      };
      reader.readAsDataURL(file);
    }
  };
  

  const studentDetails={
    name:user?.persnalDetails.name||'set name',
    gender:user?.persnalDetails.gender||'set gender',
    email:user?.persnalDetails.email||'set email',
    phone:user?.persnalDetails.phone||'set phone number'
    ,dob:user?.persnalDetails.dob||'set dob',
    country:user?.persnalDetails.country||'set country',
    languageSpoken:user?.persnalDetails.languageSpoken || [],
  }
  const displayData = isEditing ? editedData :userRole=="student"?studentDetails: {
        name:user?.persnalDetails.name||'set name',
    gender:user?.persnalDetails.gender||'set gender',
    email:user?.persnalDetails.email||'set email',
    phone:user?.persnalDetails.phone||'set phone number'
    ,dob:user?.persnalDetails.dob||'set dob',
    country:user?.persnalDetails.country||'set country',
    languageSpoken:user?.persnalDetails.languageSpoken || [],
    monthlyRate:user?.profesnalDetails.MonthlyRate || 'set Monthly Rate',
    certificates:user?.profesnalDetails.cirtificates || [],
    educationDetails:user?.profesnalDetails.educationDetails || 'set educational details',
    bio:user?.profesnalDetails.bio || 'set bio',
    specializations:user?.profesnalDetails.specializations || [] 
  };
  const profileImage = userRole === "student" 
    ? displayData.profilePic 
    : displayData.profileImage;
    
    if(isLoading){return <Loader/>}

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header with Edit Button */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-6 flex justify-between items-center border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-[#005188] text-white rounded-lg hover:bg-[#005188] transition-colors"
            >
              <FiEdit2 size={18} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <FiX size={18} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <FiSave size={18} />
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>

        {/* Profile Picture Section */}
        <div className="p-6 flex flex-col items-center bg-gradient-to-b from-blue-50 to-white">
          <div className="relative">
            <img
              src={user?.persnalDetails.profileImage}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-[#005188] text-white p-2 rounded-full cursor-pointer hover:bg-[#005188] transition-colors shadow-lg">
                <FiCamera size={20} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-800">
            {user?.persnalDetails.name}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              userRole === "teacher" ? "bg-blue-100 text-[#005188]" : "bg-green-100 text-green-700"
            }`}>
              {userRole === "teacher" ? "Teacher" : "Student"}
            </span>
            {userRole === "teacher" && displayData.verified && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                ✓ Verified
              </span>
            )}
            {userRole === "teacher" && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                displayData.online ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
              }`}>
                {displayData.online ? "● Online" : "○ Offline"}
              </span>
            )}
          </div>
          {userRole === "teacher" && (
            <div className="flex items-center gap-1 mt-2">
              <FiStar className="text-yellow-500 fill-yellow-500" />
              <span className="font-semibold text-gray-800">{displayData.rating}</span>
              <span className="text-gray-500 text-sm ml-1">/ 5.0</span>
            </div>
          )}
        </div>
      </div>

      {/* Personal Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FiUser className="text-[#005188]" />
            Personal Details
          </h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={displayData.name}
                onChange={(e) => handleInputChange("name", e.target.value, true, "personalDetails")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005188] focus:outline-none"
              />
            ) : (
              <p className="text-gray-800">{displayData.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiMail size={16} />
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={displayData.email}
                onChange={(e) => handleInputChange("email", e.target.value, true, "personalDetails")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005188] focus:outline-none"
              />
            ) : (
              <p className="text-gray-800">{displayData.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiPhone size={16} />
              Phone
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={displayData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value, true, "personalDetails")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005188] focus:outline-none"
              />
            ) : (
              <p className="text-gray-800">{displayData.phone}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            {isEditing ? (
              <select
                value={displayData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value, true, "personalDetails")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005188] focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <p className="text-gray-800">{displayData.gender}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiCalendar size={16} />
              Date of Birth
            </label>
            {isEditing ? (
              <input
                type="date"
                value={displayData.dob}
                onChange={(e) => handleInputChange("dob", e.target.value, true, "personalDetails")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005188] focus:outline-none"
              />
            ) : (
              <p className="text-gray-800">
                {new Date(displayData.dob).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </p>
            )}
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiMapPin size={16} />
              Country
            </label>
            {isEditing ? (
              <input
                type="text"
                value={displayData.country}
                onChange={(e) => handleInputChange("country", e.target.value, true, "personalDetails")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005188] focus:outline-none"
              />
            ) : (
              <p className="text-gray-800">{displayData.country}</p>
            )}
          </div>

          {/* Languages (Teacher only) */}
          {userRole === "teacher" && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FiGlobe size={16} />
                Languages Spoken
              </label>
              {isEditing ? (
                <div className="space-y-2">
                  {displayData.languageSpoken.map((lang, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={lang}
                        onChange={(e) => handleArrayChange("languageSpoken", index, e.target.value, "personalDetails")}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005188] focus:outline-none"
                        placeholder="Language"
                      />
                      <button
                        type="button"
                        onClick={() => handleArrayRemove("languageSpoken", index, "personalDetails")}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <FiX size={20} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleArrayAdd("languageSpoken", "personalDetails")}
                    className="text-[#005188] hover:text-[#005188] text-sm font-medium"
                  >
                    + Add Language
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {displayData.languageSpoken.map((lang, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-[#005188] rounded-full text-sm">
                      {lang}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Professional Details (Teacher only) */}
      {userRole === "teacher" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FiAward className="text-[#005188]" />
              Professional Details
            </h3>
          </div>
          <div className="p-6 space-y-6">
            {/* Professional Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={displayData.professionalEmail}
                  onChange={(e) => handleInputChange("professionalEmail", e.target.value, true, "profesnalDetails")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005188] focus:outline-none"
                />
              ) : (
                <p className="text-gray-800">{displayData.professionalEmail}</p>
              )}
            </div>

            {/* Monthly Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Rate ($)
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={displayData.monthlyRate}
                  onChange={(e) => handleInputChange("monthlyRate", e.target.value, true, "profesnalDetails")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005188] focus:outline-none"
                />
              ) : (
                <p className="text-gray-800">${displayData.monthlyRate}/month</p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={displayData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value, true, "profesnalDetails")}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005188] focus:outline-none"
                />
              ) : (
                <p className="text-gray-800">{displayData.bio}</p>
              )}
            </div>

            {/* Education */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Education Details
              </label>
              {isEditing ? (
                <textarea
                  value={displayData.educationDetails}
                  onChange={(e) => handleInputChange("educationDetails", e.target.value, true, "profesnalDetails")}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005188] focus:outline-none"
                />
              ) : (
                <p className="text-gray-800">{displayData.educationDetails}</p>
              )}
            </div>

            {/* Certificates */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificates
              </label>
              {isEditing ? (
                <div className="space-y-2">
                  {displayData.certificates.map((cert, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={cert}
                        onChange={(e) => handleArrayChange("certificates", index, e.target.value, "profesnalDetails")}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005188] focus:outline-none"
                        placeholder="Certificate name"
                      />
                      <button
                        type="button"
                        onClick={() => handleArrayRemove("certificates", index, "profesnalDetails")}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <FiX size={20} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleArrayAdd("certificates", "profesnalDetails")}
                    className="text-[#005188] hover:text-[#005188] text-sm font-medium"
                  >
                    + Add Certificate
                  </button>
                </div>
              ) : (
                <ul className="list-disc list-inside space-y-1">
                  {displayData.certificates.map((cert, index) => (
                    <li key={index} className="text-gray-800">{cert}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Specializations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specializations
              </label>
              {isEditing ? (
                <div className="space-y-2">
                  {displayData.specializations.map((spec, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={spec}
                        onChange={(e) => handleArrayChange("specializations", index, e.target.value, "profesnalDetails")}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#005188] focus:outline-none"
                        placeholder="Specialization"
                      />
                      <button
                        type="button"
                        onClick={() => handleArrayRemove("specializations", index, "profesnalDetails")}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <FiX size={20} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleArrayAdd("specializations", "profesnalDetails")}
                    className="text-[#005188] hover:text-[#005188] text-sm font-medium"
                  >
                    + Add Specialization
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {displayData.specializations.map((spec, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {spec}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;