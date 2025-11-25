import React, { useState, useEffect } from 'react';
import { useUser } from '../../Context/UserContext';
import { publicApi } from '../../services/api';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { GraduationCap, BookOpen, Award, ArrowLeft } from 'lucide-react';

interface TutorRegistrationForm {
  title: string;
  majorId: number;
  description: string;
  subjects: number[];
  experienceYears: number;
}

interface Subject {
  id: number;
  name: string;
  departmentId?: number;
}

interface Major {
  id: number;
  name: string;
  departmentId?: number;
}

export default function BecomeTutorPage() {
  const { user } = useUser();
  const [formData, setFormData] = useState<TutorRegistrationForm>({
    title: '',
    majorId: 0,
    description: '',
    subjects: [],
    experienceYears: 1
  });
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load subjects and majors
  useEffect(() => {
    const loadData = async () => {
      try {
        const [subjectsData, majorsData] = await Promise.all([
          publicApi.getSubjects(),
          publicApi.getMajors()
        ]);
        setSubjects(subjectsData);
        setMajors(majorsData);
      } catch (error) {
        console.error('Failed to load data:', error);
        toast.error('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'majorId' || name === 'experienceYears' ? Number(value) : value
    }));
  };

  const handleSubjectToggle = (subjectId: number) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subjectId)
        ? prev.subjects.filter(id => id !== subjectId)
        : [...prev.subjects, subjectId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast.error('Vui lòng nhập chức danh');
      return;
    }
    
    if (formData.majorId === 0) {
      toast.error('Vui lòng chọn ngành học');
      return;
    }
    
    if (formData.subjects.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 môn học');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Vui lòng nhập mô tả kinh nghiệm');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Vui lòng đăng nhập');
        return;
      }

      const response = await api.post('/api/tutor-profiles', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.statusCode === 200) {
        toast.success('Đơn đăng ký đã được gửi thành công! Vui lòng chờ admin phê duyệt.');
        
        // Reset form
        setFormData({
          title: '',
          majorId: 0,
          description: '',
          subjects: [],
          experienceYears: 1
        });
        
        // Redirect after 2 seconds
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      const errorMsg = error?.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Vui lòng đăng nhập</h3>
          <p className="text-gray-600 mb-4">Bạn cần đăng nhập để đăng ký làm gia sư</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  if (user.role !== 'STUDENT') {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center max-w-md">
          <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chỉ dành cho sinh viên</h3>
          <p className="text-gray-600">Chức năng này chỉ dành cho tài khoản sinh viên muốn đăng ký làm gia sư.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <title>Đăng ký làm gia sư</title>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="rounded-md border border-gray-300 p-2 hover:bg-gray-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              Đăng ký làm gia sư
            </h1>
            <p className="text-gray-600 mt-1">
              Điền thông tin bên dưới để đăng ký trở thành gia sư. Đơn của bạn sẽ được admin xem xét và phê duyệt.
            </p>
          </div>
        </div>

        {/* Information Banner */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex gap-3">
            <Award className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-blue-900 mb-1">Quy trình đăng ký</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>1. Điền đầy đủ thông tin trong form bên dưới</li>
                <li>2. Gửi đơn đăng ký</li>
                <li>3. Chờ admin xem xét và phê duyệt (thường trong vòng 1-2 ngày)</li>
                <li>4. Nhận thông báo kết quả qua email</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chức danh <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ví dụ: Sinh viên năm 3, Cựu sinh viên..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={submitting}
              />
              <p className="mt-1 text-sm text-gray-500">
                Mô tả ngắn gọn về bạn và trình độ của bạn
              </p>
            </div>

            {/* Major */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngành học <span className="text-red-500">*</span>
              </label>
              <select
                name="majorId"
                value={formData.majorId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={submitting}
              >
                <option value={0}>-- Chọn ngành học --</option>
                {majors.map(major => (
                  <option key={major.id} value={major.id}>
                    {major.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Years */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số năm kinh nghiệm <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleInputChange}
                min={0}
                max={20}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={submitting}
              />
              <p className="mt-1 text-sm text-gray-500">
                Số năm bạn đã có kinh nghiệm dạy/hướng dẫn
              </p>
            </div>

            {/* Subjects */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Môn học có thể dạy <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
                {subjects.map(subject => (
                  <label
                    key={subject.id}
                    className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.subjects.includes(subject.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.subjects.includes(subject.id)}
                      onChange={() => handleSubjectToggle(subject.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={submitting}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {subject.name}
                    </span>
                  </label>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Đã chọn: {formData.subjects.length} môn
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả kinh nghiệm và kỹ năng <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                placeholder="Ví dụ: Mình có 2 năm kinh nghiệm dạy lập trình cho sinh viên năm 1, 2. Chuyên về Java, Python và cơ sở dữ liệu. Từng đạt điểm A+ các môn lập trình và có kinh nghiệm làm mentor trong câu lạc bộ..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={submitting}
              />
              <p className="mt-1 text-sm text-gray-500">
                Chia sẻ về kinh nghiệm, kỹ năng và phương pháp giảng dạy của bạn (tối thiểu 50 ký tự)
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => window.history.back()}
                disabled={submitting}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[160px] justify-center"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <BookOpen className="h-5 w-5" />
                    Gửi đơn đăng ký
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Help Text */}
        <div className="text-sm text-gray-500 text-center">
          Nếu bạn có câu hỏi, vui lòng liên hệ admin qua email: admin@hcmut.edu.vn
        </div>
      </div>
    </>
  );
}
