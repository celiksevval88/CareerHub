import { useState } from 'react'
import './App.css'
function formatApplicationStatus(status) {
  const statuses = {
    BEKLEMEDE: 'Beklemede',
    DEĞERLENDİRİLİYOR: 'Değerlendiriliyor',
    KABUL_EDİLDİ: 'Kabul edildi',
    REDDEDİLDİ: 'Reddedildi',
  }

  return statuses[status] || status
}

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // Kayıt formu
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [registerMessage, setRegisterMessage] = useState('')

  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'STUDENT',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [currentUser, setCurrentUser] = useState(null)

  const [jobPostings, setJobPostings] = useState([])
  const [isLoadingJobs, setIsLoadingJobs] = useState(false)
  const [jobsError, setJobsError] = useState('')
  const [showJobPostings, setShowJobPostings] = useState(false)
  const [applyingJobId, setApplyingJobId] = useState(null)
  const [applicationMessage, setApplicationMessage] = useState('')
  const [applicationMessageType, setApplicationMessageType] = useState('')

  const [applications, setApplications] = useState([])
  const [isLoadingApplications, setIsLoadingApplications] = useState(false)
  const [applicationsError, setApplicationsError] = useState('')
  const [showApplications, setShowApplications] = useState(false)
  const [studentCv, setStudentCv] = useState(null)
  const [isLoadingCv, setIsLoadingCv] = useState(false)
  const [cvError, setCvError] = useState('')
  const [showCv, setShowCv] = useState(false)
  const [showCvForm, setShowCvForm] = useState(false)
  const [isSavingCv, setIsSavingCv] = useState(false)
  const [cvFormMessage, setCvFormMessage] = useState('')

  const [cvForm, setCvForm] = useState({
    title: '',
    about: '',
    education: '',
    skills: '',
    experiences: '',
    projects: '',
  })
  // Şirket profili
  const [companyProfile, setCompanyProfile] = useState(null)
  const [isLoadingCompany, setIsLoadingCompany] = useState(false)
  const [companyError, setCompanyError] = useState('')
  const [showCompanyProfile, setShowCompanyProfile] = useState(false)
  // Şirket profilini düzenleme
  const [showCompanyForm, setShowCompanyForm] = useState(false)
  const [isSavingCompany, setIsSavingCompany] = useState(false)
  const [companyFormMessage, setCompanyFormMessage] = useState('')

  const [companyForm, setCompanyForm] = useState({
    companyName: '',
    sector: '',
    city: '',
    website: '',
    description: '',
  })
  const [updatingApplicationId, setUpdatingApplicationId] = useState(null)
  const [companyApplicationMessage, setCompanyApplicationMessage] = useState('')
  // Yeni ilan oluşturma formu
  const [showCreateJobForm, setShowCreateJobForm] = useState(false)
  const [isCreatingJob, setIsCreatingJob] = useState(false)
  const [createJobMessage, setCreateJobMessage] = useState('')
  const [editingJobId, setEditingJobId] = useState(null)
  const [isUpdatingJob, setIsUpdatingJob] = useState(false)
  const [updateJobMessage, setUpdateJobMessage] = useState('')
  const [deletingJobId, setDeletingJobId] = useState(null)
  const [deleteJobMessage, setDeleteJobMessage] = useState('')

  const [createJobForm, setCreateJobForm] = useState({
    title: '',
    type: 'STAJ',
    city: '',
    workType: 'HİBRİT',
    description: '',
  })

  // Şirketin kendi ilanları
  const [companyJobPostings, setCompanyJobPostings] = useState([])
  const [isLoadingCompanyJobs, setIsLoadingCompanyJobs] = useState(false)
  const [companyJobsError, setCompanyJobsError] = useState('')
  const [showCompanyJobs, setShowCompanyJobs] = useState(false)
  // Şirketin ilanlarına gelen başvurular
  const [companyApplications, setCompanyApplications] = useState([])
  const [isLoadingCompanyApplications, setIsLoadingCompanyApplications] = useState(false)
  const [companyApplicationsError, setCompanyApplicationsError] = useState('')
  const [showCompanyApplications, setShowCompanyApplications] = useState(false)
  // Yönetici: şirket onayları
  const [adminCompanies, setAdminCompanies] = useState([])
  const [isLoadingAdminCompanies, setIsLoadingAdminCompanies] = useState(false)
  const [adminCompaniesError, setAdminCompaniesError] = useState('')
  const [adminCompanyMessage, setAdminCompanyMessage] = useState('')
  const [updatingAdminCompanyId, setUpdatingAdminCompanyId] = useState(null)

  // Kullanıcı girişi
  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setMessage(
          data.message ||
          'Giriş başarısız. E-posta veya şifreni kontrol et.',
        )
        return
      }

      if (!data.token) {
        setMessage('Giriş yanıtında token bulunamadı.')
        return
      }

      localStorage.setItem('careerhub_token', data.token)
      localStorage.setItem('careerhub_email', data.email || email)

      // Giriş yapan kullanıcının bilgilerini getir
      const profileResponse = await fetch('/api/users/me', {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      })

      const profile = await profileResponse.json().catch(() => ({}))

      if (!profileResponse.ok) {
        setMessage('Kullanıcı bilgileri alınamadı. Tekrar giriş yap.')
        return
      }
      setStudentCv(null)
      setCvError('')
      setCvFormMessage('')

      setCvForm({
        title: '',
        about: '',
        education: '',
        skills: '',
        experiences: '',
        projects: '',
      })

      setShowCvForm(false)
      setApplications([])
      setApplicationsError('')
      setShowApplications(false)
      setShowCv(false)
      setShowJobPostings(false)
      // Önceki şirket profilini temizle
      setCompanyProfile(null)
      setCompanyError('')
      setShowCompanyProfile(false)
      setShowCompanyForm(false)
      setIsSavingCompany(false)
      setCompanyFormMessage('')

      setCompanyForm({
        companyName: '',
        sector: '',
        city: '',
        website: '',
        description: '',
      })

      // Şirket başvurularını temizle
      setUpdatingApplicationId(null)
      setCompanyApplicationMessage('')
      setCompanyApplications([])
      setCompanyApplicationsError('')
      setIsLoadingCompanyApplications(false)
      setShowCompanyApplications(false)

      // Şirket ilanlarını temizle
      setCompanyJobPostings([])
      setCompanyJobsError('')
      setIsLoadingCompanyJobs(false)
      setShowCompanyJobs(false)

      // İlan oluşturma ve düzenleme formlarını temizle
      setShowCreateJobForm(false)
      setIsCreatingJob(false)
      setCreateJobMessage('')
      setEditingJobId(null)
      setIsUpdatingJob(false)
      setUpdateJobMessage('')
      setDeletingJobId(null)
      setDeleteJobMessage('')

      setCreateJobForm({
        title: '',
        type: 'STAJ',
        city: '',
        workType: 'HİBRİT',
        description: '',
      })
      setCurrentUser(profile)
    } catch {
      setMessage(
        'Sunucuya bağlanılamadı. Backend uygulamasının çalıştığını kontrol et.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  // İlanları backend üzerinden getir
  async function loadJobPostings() {
    setIsLoadingJobs(true)
    setJobsError('')

    // Diğer öğrenci bölümlerini kapat
    setShowApplications(false)
    setShowCv(false)

    // Yalnızca ilanları aç
    setShowJobPostings(true)

    try {
      const token = localStorage.getItem('careerhub_token')

      const response = await fetch('/api/job-postings', {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {},
      })

      const data = await response.json().catch(() => [])

      if (!response.ok) {
        setJobsError(
          data.message ||
          `İlanlar yüklenemedi (HTTP ${response.status}).`,
        )
        setJobPostings([])
        return
      }

      if (!Array.isArray(data)) {
        setJobsError('Sunucudan beklenen ilan listesi alınamadı.')
        setJobPostings([])
        return
      }

      setJobPostings(data)
    } catch {
      setJobsError(
        'Sunucuya bağlanılamadı. Backend uygulamasını kontrol et.',
      )
      setJobPostings([])
    } finally {
      setIsLoadingJobs(false)
    }
  }
  // Öğrencinin ilana başvurması
  async function applyToJob(job) {
    setApplyingJobId(job.id)
    setApplicationMessage('')
    setApplicationMessageType('')

    try {
      const token = localStorage.getItem('careerhub_token')

      if (!token) {
        setApplicationMessage('Oturum bilgisi bulunamadı. Yeniden giriş yap.')
        setApplicationMessageType('error')
        return
      }

      const response = await fetch('/api/job-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobPostingId: job.id,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setApplicationMessage(
          data.message ||
          (response.status === 403
            ? 'Bu işlem için yetkin bulunmuyor.'
            : 'Başvuru gönderilemedi. Lütfen tekrar dene.'),
        )
        setApplicationMessageType('error')
        return
      }

      setApplicationMessage(
        `"${job.title}" ilanına başvurun başarıyla gönderildi.`,
      )
      setApplicationMessageType('success')
    } catch {
      setApplicationMessage(
        'Sunucuya bağlanılamadı. Backend uygulamasını kontrol et.',
      )
      setApplicationMessageType('error')
    } finally {
      setApplyingJobId(null)
    }
  }
  // Öğrencinin kendi başvurularını getir
  async function loadApplications() {
    setIsLoadingApplications(true)
    setApplicationsError('')
    setApplications([])

    // Diğer öğrenci bölümlerini kapat
    setShowJobPostings(false)
    setShowCv(false)

    // Yalnızca Başvurularım bölümünü aç
    setShowApplications(true)

    try {
      const token = localStorage.getItem('careerhub_token')

      const response = await fetch('/api/job-applications/student', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json().catch(() => [])

      if (!response.ok) {
        setApplicationsError(
          data.message || 'Başvurular yüklenemedi.',
        )
        setApplications([])
        return
      }

      if (!Array.isArray(data)) {
        setApplicationsError('Sunucudan geçerli bir başvuru listesi alınamadı.')
        setApplications([])
        return
      }

      setApplications(data)
    } catch {
      setApplicationsError(
        'Sunucuya bağlanılamadı. Backend uygulamasını kontrol et.',
      )
      setApplications([])
    } finally {
      setIsLoadingApplications(false)
    }
  }
  // Öğrencinin CV bilgilerini getir
  async function loadCv() {
    setIsLoadingCv(true)
    setCvError('')

    // Diğer öğrenci bölümlerini kapat
    setShowJobPostings(false)
    setShowApplications(false)

    // Yalnızca CV bölümünü aç
    setShowCv(true)

    try {
      const token = localStorage.getItem('careerhub_token')

      const response = await fetch('/api/student-cv', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setCvError(
          data.message || 'CV bilgileri yüklenemedi.',
        )
        setStudentCv(null)
        return
      }

      setStudentCv(data)
    } catch {
      setCvError(
        'Sunucuya bağlanılamadı. Backend uygulamasını kontrol et.',
      )
      setStudentCv(null)
    } finally {
      setIsLoadingCv(false)
    }
  }
  // CV formunu mevcut bilgilerle aç
  function openCvForm() {
    setCvForm({
      title: studentCv?.title || '',
      about: studentCv?.about || '',
      education: studentCv?.education || '',
      skills: studentCv?.skills || '',
      experiences: studentCv?.experiences || '',
      projects: studentCv?.projects || '',
    })

    setCvFormMessage('')
    setShowCvForm(true)
  }

  // CV oluştur veya mevcut CV'yi güncelle
  async function saveCv(event) {
    event.preventDefault()
    setIsSavingCv(true)
    setCvFormMessage('')

    try {
      const token = localStorage.getItem('careerhub_token')

      if (!token) {
        setCvFormMessage('Oturum bilgisi bulunamadı. Tekrar giriş yap.')
        return
      }

      const method = studentCv?.id ? 'PUT' : 'POST'

      const response = await fetch('/api/student-cv', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cvForm),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setCvFormMessage(data.message || 'CV kaydedilemedi. Tekrar dene.')
        return
      }

      setStudentCv(data)
      setCvFormMessage('CV başarıyla kaydedildi.')
      setShowCvForm(false)
      setShowCv(true)
    } catch {
      setCvFormMessage('Sunucuya bağlanılamadı. Backend uygulamasını kontrol et.')
    } finally {
      setIsSavingCv(false)
    }
  }
  // Şirket profilini backend'den getir
  async function loadCompanyProfile() {
    setIsLoadingCompany(true)
    setCompanyError('')

    // Diğer şirket bölümlerini kapat
    setShowCompanyJobs(false)
    setShowCompanyApplications(false)
    setShowCreateJobForm(false)

    // Yalnızca şirket profilini aç
    setShowCompanyProfile(true)

    try {
      const token = localStorage.getItem('careerhub_token')

      if (!token) {
        setCompanyError('Oturum bilgisi bulunamadı. Tekrar giriş yap.')
        setCompanyProfile(null)
        return
      }

      const response = await fetch('/api/company', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setCompanyError(
          data.message || 'Şirket profili yüklenemedi.',
        )
        setCompanyProfile(null)
        return
      }

      setCompanyProfile(data)
    } catch {
      setCompanyError(
        'Sunucuya bağlanılamadı. Backend uygulamasını kontrol et.',
      )
      setCompanyProfile(null)
    } finally {
      setIsLoadingCompany(false)
    }
  }
  // Şirketin kendi ilanlarını backend'den getir
  async function loadCompanyJobPostings() {
    setIsLoadingCompanyJobs(true)
    setCompanyJobsError('')

    // Diğer açık bölümleri kapat
    setShowCompanyProfile(false)
    setShowCompanyApplications(false)
    setShowCreateJobForm(false)

    // Yalnızca İlanlarım bölümünü aç
    setShowCompanyJobs(true)

    try {
      const token = localStorage.getItem('careerhub_token')

      if (!token) {
        setCompanyJobsError('Oturum bilgisi bulunamadı. Tekrar giriş yap.')
        setCompanyJobPostings([])
        return
      }

      const response = await fetch('/api/job-postings/company', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json().catch(() => [])

      if (!response.ok) {
        setCompanyJobsError(
          data.message || 'Şirket ilanları yüklenemedi.',
        )
        setCompanyJobPostings([])
        return
      }

      if (!Array.isArray(data)) {
        setCompanyJobsError('Sunucudan geçerli bir ilan listesi alınamadı.')
        setCompanyJobPostings([])
        return
      }

      setCompanyJobPostings(data)
    } catch {
      setCompanyJobsError(
        'Sunucuya bağlanılamadı. Backend uygulamasını kontrol et.',
      )
      setCompanyJobPostings([])
    } finally {
      setIsLoadingCompanyJobs(false)
    }
  }
  // Şirketin ilanlarına gelen başvuruları getir
  async function loadCompanyApplications() {
    setIsLoadingCompanyApplications(true)
    setCompanyApplicationsError('')

    // Diğer şirket bölümlerini kapat
    setShowCompanyProfile(false)
    setShowCompanyJobs(false)
    setShowCreateJobForm(false)

    // Yalnızca başvuruları aç
    setShowCompanyApplications(true)

    try {
      const token = localStorage.getItem('careerhub_token')

      if (!token) {
        setCompanyApplicationsError(
          'Oturum bilgisi bulunamadı. Tekrar giriş yap.',
        )
        setCompanyApplications([])
        return
      }

      const response = await fetch('/api/job-applications/company', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json().catch(() => [])

      if (!response.ok) {
        setCompanyApplicationsError(
          data.message || 'Başvurular yüklenemedi.',
        )
        setCompanyApplications([])
        return
      }

      if (!Array.isArray(data)) {
        setCompanyApplicationsError(
          'Sunucudan geçerli bir başvuru listesi alınamadı.',
        )
        setCompanyApplications([])
        return
      }

      setCompanyApplications(data)
    } catch {
      setCompanyApplicationsError(
        'Sunucuya bağlanılamadı. Backend uygulamasını kontrol et.',
      )
      setCompanyApplications([])
    } finally {
      setIsLoadingCompanyApplications(false)
    }
  }
  // Şirket başvuru durumunu güncelle
  async function updateCompanyApplicationStatus(applicationId, status) {
    setUpdatingApplicationId(applicationId)
    setCompanyApplicationMessage('')

    try {
      const token = localStorage.getItem('careerhub_token')

      if (!token) {
        setCompanyApplicationMessage(
          'Oturum bilgisi bulunamadı. Tekrar giriş yap.',
        )
        return
      }

      const response = await fetch(
        `/api/job-applications/${applicationId}/status?status=${encodeURIComponent(status)}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setCompanyApplicationMessage(
          data.message || 'Başvuru durumu güncellenemedi.',
        )
        return
      }

      setCompanyApplications((previousApplications) =>
        previousApplications.map((application) =>
          application.id === applicationId ? data : application,
        ),
      )

      setCompanyApplicationMessage('Başvuru durumu başarıyla güncellendi.')
    } catch {
      setCompanyApplicationMessage(
        'Sunucuya bağlanılamadı. Backend uygulamasını kontrol et.',
      )
    } finally {
      setUpdatingApplicationId(null)
    }
  }
  // Yeni ilan oluştur
  async function createJobPosting(event) {
    event.preventDefault()
    setIsCreatingJob(true)
    setCreateJobMessage('')

    try {
      const token = localStorage.getItem('careerhub_token')

      if (!token) {
        setCreateJobMessage(
          'Oturum bilgisi bulunamadı. Tekrar giriş yap.',
        )
        return
      }

      const response = await fetch('/api/job-postings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(createJobForm),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setCreateJobMessage(
          data.message || 'İlan oluşturulamadı. Bilgileri kontrol et.',
        )
        return
      }

      setCreateJobMessage(
        `"${data.title || createJobForm.title}" ilanı başarıyla oluşturuldu.`,
      )

      setCreateJobForm({
        title: '',
        type: 'STAJ',
        city: '',
        workType: 'HİBRİT',
        description: '',
      })

      setShowCreateJobForm(false)

      // Şirketin ilan listesini yenile
      await loadCompanyJobPostings()
    } catch {
      setCreateJobMessage(
        'Sunucuya bağlanılamadı. Backend uygulamasını kontrol et.',
      )
    } finally {
      setIsCreatingJob(false)
    }
  }
  // Mevcut ilanı güncelle
  async function saveJobChanges(event) {
    event.preventDefault()
    setIsUpdatingJob(true)
    setUpdateJobMessage('')

    try {
      const token = localStorage.getItem('careerhub_token')

      if (!token) {
        setUpdateJobMessage(
          'Oturum bilgisi bulunamadı. Tekrar giriş yap.',
        )
        return
      }

      if (!editingJobId) {
        setUpdateJobMessage('Düzenlenecek ilan seçilmedi.')
        return
      }

      const response = await fetch(
        `/api/job-postings/${editingJobId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(createJobForm),
        },
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setUpdateJobMessage(
          data.message || 'İlan güncellenemedi. Bilgileri kontrol et.',
        )
        return
      }

      setCompanyJobPostings((previousJobs) =>
        previousJobs.map((job) =>
          job.id === data.id ? data : job,
        ),
      )

      setUpdateJobMessage('İlan başarıyla güncellendi.')
      setShowCreateJobForm(false)
      setEditingJobId(null)

      setCreateJobForm({
        title: '',
        type: 'STAJ',
        city: '',
        workType: 'HİBRİT',
        description: '',
      })

      await loadCompanyJobPostings()
    } catch {
      setUpdateJobMessage(
        'Sunucuya bağlanılamadı. Backend uygulamasını kontrol et.',
      )
    } finally {
      setIsUpdatingJob(false)
    }
  }
  // Şirketin kendi ilanını sil
  async function deleteJobPosting(jobId) {
    const approved = window.confirm(
      'Bu ilanı silmek istediğine emin misin? Bu işlem geri alınamaz.',
    )

    if (!approved) {
      return
    }

    setDeletingJobId(jobId)
    setDeleteJobMessage('')

    try {
      const token = localStorage.getItem('careerhub_token')

      if (!token) {
        setDeleteJobMessage(
          'Oturum bilgisi bulunamadı. Tekrar giriş yap.',
        )
        return
      }

      const response = await fetch(`/api/job-postings/${jobId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const responseText = await response.text()

      if (!response.ok) {
        setDeleteJobMessage(
          responseText || 'İlan silinemedi. Tekrar dene.',
        )
        return
      }

      setCompanyJobPostings((previousJobs) =>
        previousJobs.filter((job) => job.id !== jobId),
      )

      if (editingJobId === jobId) {
        setEditingJobId(null)
        setShowCreateJobForm(false)
      }

      setDeleteJobMessage('İlan başarıyla silindi.')
    } catch {
      setDeleteJobMessage(
        'Sunucuya bağlanılamadı. Backend uygulamasını kontrol et.',
      )
    } finally {
      setDeletingJobId(null)
    }
  }
  // Şirket profil düzenleme formunu mevcut bilgilerle aç
  function openCompanyForm() {
    setCompanyForm({
      companyName: companyProfile?.companyName || '',
      sector: companyProfile?.sector || '',
      city: companyProfile?.city || '',
      website: companyProfile?.website || '',
      description: companyProfile?.description || '',
    })

    setCompanyFormMessage('')
    setShowCompanyForm(true)
  }

  // Şirket profilini güncelle
  async function saveCompanyProfile(event) {
    event.preventDefault()
    setIsSavingCompany(true)
    setCompanyFormMessage('')

    try {
      const token = localStorage.getItem('careerhub_token')

      if (!token) {
        setCompanyFormMessage(
          'Oturum bilgisi bulunamadı. Tekrar giriş yap.',
        )
        return
      }

      const response = await fetch('/api/company', {
        method: companyProfile ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(companyForm),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setCompanyFormMessage(
          data.message || 'Şirket profili güncellenemedi.',
        )
        return
      }

      setCompanyProfile(data)
      setCompanyError('')

      setCompanyFormMessage(
        companyProfile
          ? 'Şirket profili başarıyla güncellendi.'
          : 'Şirket profili başarıyla oluşturuldu.',
      )

      setShowCompanyForm(false)
    } catch {
      setCompanyFormMessage(
        'Sunucuya bağlanılamadı. Backend uygulamasını kontrol et.',
      )
    } finally {
      setIsSavingCompany(false)
    }
  }
  // Yönetici: şirketleri listele
  async function loadAdminCompanies() {
    setIsLoadingAdminCompanies(true)
    setAdminCompaniesError('')
    setAdminCompanyMessage('')

    try {
      const token = localStorage.getItem('careerhub_token')

      const response = await fetch('/api/admin/companies', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json().catch(() => [])

      if (!response.ok) {
        setAdminCompaniesError(
          data.message || 'Şirketler yüklenemedi.',
        )
        setAdminCompanies([])
        return
      }

      if (!Array.isArray(data)) {
        setAdminCompaniesError(
          'Sunucudan geçerli bir şirket listesi alınamadı.',
        )
        setAdminCompanies([])
        return
      }

      setAdminCompanies(data)
    } catch {
      setAdminCompaniesError(
        'Sunucuya bağlanılamadı. Backend uygulamasını kontrol et.',
      )
      setAdminCompanies([])
    } finally {
      setIsLoadingAdminCompanies(false)
    }
  }
  // Yönetici: şirket onay durumunu güncelle
  async function updateAdminCompanyApproval(companyId, status) {
    setUpdatingAdminCompanyId(companyId)
    setAdminCompaniesError('')
    setAdminCompanyMessage('')

    try {
      const token = localStorage.getItem('careerhub_token')

      const response = await fetch(
        `/api/admin/companies/${companyId}/approval?status=${status}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setAdminCompaniesError(
          data.message || 'Şirket onay durumu güncellenemedi.',
        )
        return
      }

      setAdminCompanies((previous) =>
        previous.map((company) =>
          company.id === companyId ? data : company,
        ),
      )

      setAdminCompanyMessage(
        status === 'APPROVED'
          ? 'Şirket başarıyla onaylandı.'
          : 'Şirket reddedildi.',
      )
    } catch {
      setAdminCompaniesError(
        'Sunucuya bağlanılamadı. Backend uygulamasını kontrol et.',
      )
    } finally {
      setUpdatingAdminCompanyId(null)
    }
  }
  // Yeni kullanıcı hesabı oluştur
  async function registerUser(event) {
    event.preventDefault()
    setIsRegistering(true)
    setRegisterMessage('')

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerForm),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        const errorMessage = data.message || ''

        if (
          response.status === 409 ||
          errorMessage.includes('Bu e-posta adresi zaten kayıtlı')
        ) {
          setRegisterMessage(
            'Bu e-posta adresi zaten kayıtlı. Giriş yapabilir veya farklı bir e-posta kullanabilirsin.',
          )
        } else {
          setRegisterMessage(
            errorMessage || 'Kayıt oluşturulamadı. Bilgileri kontrol et.',
          )
        }

        return
      }

      setEmail(registerForm.email)
      setPassword('')
      setRegisterForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'STUDENT',
      })

      setShowRegisterForm(false)
      setRegisterMessage(
        'Hesabın oluşturuldu. Giriş yapmadan önce e-posta adresine gönderdiğimiz doğrulama bağlantısına tıkla.',
      )
    } catch {
      setRegisterMessage(
        'Sunucuya bağlanılamadı. Backend uygulamasını kontrol et.',
      )
    } finally {
      setIsRegistering(false)
    }
  }
  // Giriş yapan kullanıcının paneli
  if (currentUser) {
    const roleTitle =
      currentUser.role === 'STUDENT'
        ? 'Öğrenci Paneli'
        : currentUser.role === 'COMPANY'
          ? 'Şirket Paneli'
          : currentUser.role === 'ADMIN'
            ? 'Yönetici Paneli'
            : 'CareerHub Paneli'

    return (
      <main className="dashboard-page">
        <header className="dashboard-header">
          <div className="brand dashboard-brand">
            <span className="brand-icon">C</span>
            <span>
              Career<span className="brand-light">Hub</span>
            </span>
          </div>

          <div className="dashboard-account">
            <div>
              <strong>
                {currentUser.firstName} {currentUser.lastName}
              </strong>
              <span>{currentUser.email}</span>
            </div>

            <button
              type="button"
              className="logout-button"
              onClick={() => {
                localStorage.removeItem('careerhub_token')
                localStorage.removeItem('careerhub_email')
                setCurrentUser(null)
                setPassword('')
                setMessage('')
                setJobPostings([])
                setShowJobPostings(false)
              }}
            >
              Çıkış Yap
            </button>
          </div>
        </header>

        <section className="dashboard-content">
          <span className="form-eyebrow">
            {roleTitle.toUpperCase()}
          </span>

          <h1>Merhaba, {currentUser.firstName}!</h1>

          <p className="dashboard-description">
            Kariyer yolculuğuna buradan devam edebilirsin.
          </p>

          {currentUser.role === 'STUDENT' ? (
            <>
              <div className="dashboard-grid">
                <article
                  className="dashboard-card clickable-card"
                  role="button"
                  tabIndex={0}
                  onClick={loadJobPostings}
                  onKeyDown={(event) => {
                    if (
                      event.key === 'Enter' ||
                      event.key === ' '
                    ) {
                      event.preventDefault()
                      loadJobPostings()
                    }
                  }}
                >
                  <span className="dashboard-card-icon">↗</span>
                  <h2>İş ve staj ilanları</h2>
                  <p>Sana uygun kariyer fırsatlarını keşfet.</p>
                </article>

                <article
                  className="dashboard-card clickable-card"
                  role="button"
                  tabIndex={0}
                  onClick={loadApplications}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      loadApplications()
                    }
                  }}
                >
                  <span className="dashboard-card-icon">✓</span>
                  <h2>Başvurularım</h2>
                  <p>Başvurularının durumunu takip et.</p>
                </article>

                <article
                  className="dashboard-card clickable-card"
                  role="button"
                  tabIndex={0}
                  onClick={loadCv}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      loadCv()
                    }
                  }}
                >
                  <span className="dashboard-card-icon">▤</span>
                  <h2>CV profilim</h2>
                  <p>CV bilgilerini görüntüle.</p>
                </article>
              </div>

              {showJobPostings && (
                <section className="job-list-section">
                  <div className="job-list-heading">
                    <h2>İş ve staj ilanları</h2>

                    <button
                      type="button"
                      className="logout-button"
                      onClick={() => setShowJobPostings(false)}
                    >
                      Kapat
                    </button>
                  </div>

                  {isLoadingJobs && (
                    <p>İlanlar yükleniyor...</p>
                  )}

                  {jobsError && (
                    <p role="alert">{jobsError}</p>
                  )}

                  {!isLoadingJobs &&
                    !jobsError &&
                    jobPostings.length === 0 && (
                      <p>Henüz yayınlanmış ilan bulunmuyor.</p>
                    )}

                  {!isLoadingJobs &&
                    !jobsError &&
                    jobPostings.length > 0 && (
                      <div className="job-list-grid">
                        {jobPostings.map((job) => (
                          <article
                            className="job-list-card"
                            key={job.id}
                          >
                            <div className="job-list-card-top">
                              <div>
                                <h3>{job.title}</h3>
                                <p>{job.companyName}</p>
                              </div>

                              <span className="job-type">
                                {job.type}
                              </span>
                            </div>

                            <div className="job-meta">
                              <span>{job.city}</span>
                              <span>{job.workType}</span>
                            </div>

                            <p>{job.description}</p>
                            <button
                              type="button"
                              className="login-button apply-button"
                              onClick={() => applyToJob(job)}
                              disabled={applyingJobId === job.id}
                            >
                              {applyingJobId === job.id ? 'Başvuruluyor...' : 'Başvur'}
                            </button>
                          </article>
                        ))}
                      </div>
                    )}
                  {applicationMessage && (
                    <p
                      className={`application-message ${applicationMessageType}`}
                      role="status"
                    >
                      {applicationMessage}
                    </p>
                  )}
                </section>
              )}
              {showApplications && (
                <section className="job-list-section">
                  <div className="job-list-heading">
                    <h2>Başvurularım</h2>

                    <button
                      type="button"
                      className="logout-button"
                      onClick={() => setShowApplications(false)}
                    >
                      Kapat
                    </button>
                  </div>

                  {isLoadingApplications && <p>Başvuruların yükleniyor...</p>}

                  {applicationsError && (
                    <p role="alert">{applicationsError}</p>
                  )}

                  {!isLoadingApplications &&
                    !applicationsError &&
                    applications.length === 0 && (
                      <p>Henüz bir ilana başvurmadın.</p>
                    )}

                  {!isLoadingApplications &&
                    !applicationsError &&
                    applications.length > 0 && (
                      <div className="job-list-grid">
                        {applications.map((application) => (
                          <article
                            className="job-list-card"
                            key={application.id}
                          >
                            <div className="job-list-card-top">
                              <div>
                                <h3>{application.jobTitle}</h3>
                                <p>{application.companyName}</p>
                              </div>

                              <span className="job-type">
                                {formatApplicationStatus(application.status)}
                              </span>
                            </div>

                            <p>
                              Başvuru tarihi:{' '}
                              {application.applicationDate
                                ? new Date(
                                  application.applicationDate,
                                ).toLocaleString('tr-TR')
                                : 'Belirtilmedi'}
                            </p>
                          </article>
                        ))}
                      </div>
                    )}
                </section>
              )}
              {showCv && (
                <section className="job-list-section">
                  <div className="job-list-heading">
                    <h2>CV Profilim</h2>

                    <div className="cv-form-actions">
                      <button
                        type="button"
                        className="logout-button"
                        onClick={openCvForm}
                      >
                        {studentCv ? 'CV’yi Düzenle' : 'CV Oluştur'}
                      </button>

                      <button
                        type="button"
                        className="logout-button"
                        onClick={() => {
                          setShowCv(false)
                          setShowCvForm(false)
                        }}
                      >
                        Kapat
                      </button>
                    </div>
                  </div>

                  {isLoadingCv && <p>CV bilgilerin yükleniyor...</p>}

                  {cvError && !showCvForm && (
                    <p role="alert">{cvError}</p>
                  )}

                  {cvFormMessage && (
                    <p className="status-message" role="status">
                      {cvFormMessage}
                    </p>
                  )}

                  {showCvForm && (
                    <form className="cv-edit-form" onSubmit={saveCv}>
                      <label htmlFor="cv-title">CV başlığı</label>
                      <input
                        id="cv-title"
                        value={cvForm.title}
                        onChange={(event) =>
                          setCvForm({ ...cvForm, title: event.target.value })
                        }
                        placeholder="Örn. Java ve Spring Boot Geliştiricisi"
                        required
                      />

                      <label htmlFor="cv-about">Hakkımda</label>
                      <textarea
                        id="cv-about"
                        rows={4}
                        value={cvForm.about}
                        onChange={(event) =>
                          setCvForm({ ...cvForm, about: event.target.value })
                        }
                        placeholder="Kendini ve kariyer hedeflerini anlat."
                      />

                      <label htmlFor="cv-education">Eğitim</label>
                      <textarea
                        id="cv-education"
                        rows={3}
                        value={cvForm.education}
                        onChange={(event) =>
                          setCvForm({ ...cvForm, education: event.target.value })
                        }
                        placeholder="Üniversite, bölüm ve eğitim bilgilerin"
                      />

                      <label htmlFor="cv-skills">Yetenekler</label>
                      <textarea
                        id="cv-skills"
                        rows={3}
                        value={cvForm.skills}
                        onChange={(event) =>
                          setCvForm({ ...cvForm, skills: event.target.value })
                        }
                        placeholder="Java, Spring Boot, SQL..."
                      />

                      <label htmlFor="cv-experiences">Deneyimler</label>
                      <textarea
                        id="cv-experiences"
                        rows={3}
                        value={cvForm.experiences}
                        onChange={(event) =>
                          setCvForm({ ...cvForm, experiences: event.target.value })
                        }
                        placeholder="Staj ve iş deneyimlerin"
                      />

                      <label htmlFor="cv-projects">Projeler</label>
                      <textarea
                        id="cv-projects"
                        rows={3}
                        value={cvForm.projects}
                        onChange={(event) =>
                          setCvForm({ ...cvForm, projects: event.target.value })
                        }
                        placeholder="Geliştirdiğin projeler"
                      />

                      <div className="cv-form-actions">
                        <button
                          type="submit"
                          className="login-button"
                          disabled={isSavingCv}
                        >
                          {isSavingCv ? 'Kaydediliyor...' : 'CV’yi Kaydet'}
                        </button>

                        <button
                          type="button"
                          className="logout-button"
                          onClick={() => {
                            setShowCvForm(false)
                            setCvFormMessage('')
                          }}
                        >
                          Vazgeç
                        </button>
                      </div>
                    </form>
                  )}

                  {!isLoadingCv && !showCvForm && studentCv && (
                    <article className="job-list-card">
                      <h3>{studentCv.title || 'CV başlığı belirtilmemiş'}</h3>

                      <p>
                        <strong>Ad Soyad:</strong>{' '}
                        {studentCv.firstName} {studentCv.lastName}
                      </p>

                      <p>
                        <strong>E-posta:</strong> {studentCv.email}
                      </p>

                      <h3>Hakkımda</h3>
                      <p>{studentCv.about || 'Henüz bilgi eklenmemiş.'}</p>

                      <h3>Eğitim</h3>
                      <p>{studentCv.education || 'Henüz bilgi eklenmemiş.'}</p>

                      <h3>Yetenekler</h3>
                      <p>{studentCv.skills || 'Henüz bilgi eklenmemiş.'}</p>

                      <h3>Deneyimler</h3>
                      <p>{studentCv.experiences || 'Henüz bilgi eklenmemiş.'}</p>

                      <h3>Projeler</h3>
                      <p>{studentCv.projects || 'Henüz bilgi eklenmemiş.'}</p>
                    </article>
                  )}
                </section>
              )}

            </>
          ) : currentUser.role === 'COMPANY' ? (
            <>
              <div className="dashboard-grid">
                <article
                  className="dashboard-card clickable-card"
                  role="button"
                  tabIndex={0}
                  onClick={loadCompanyProfile}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      loadCompanyProfile()
                    }
                  }}
                >
                  <span className="dashboard-card-icon">▤</span>
                  <h2>Şirket Profilim</h2>
                  <p>Şirket bilgilerini görüntüle.</p>
                </article>

                <article
                  className="dashboard-card clickable-card"
                  role="button"
                  tabIndex={0}
                  onClick={loadCompanyJobPostings}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      loadCompanyJobPostings()
                    }
                  }}
                >
                  <span className="dashboard-card-icon">↗</span>
                  <h2>İlanlarım</h2>
                  <p>Yayınladığın ilanları görüntüle.</p>
                </article>

                <article
                  className="dashboard-card clickable-card"
                  role="button"
                  tabIndex={0}
                  onClick={loadCompanyApplications}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      loadCompanyApplications()
                    }
                  }}
                >
                  <span className="dashboard-card-icon">✓</span>
                  <h2>Başvurular</h2>
                  <p>İlanlarına gelen başvuruları incele.</p>
                </article>
                <article
                  className="dashboard-card clickable-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setCreateJobMessage('')
                    setUpdateJobMessage('')
                    setShowCompanyProfile(false)
                    setShowCompanyJobs(false)
                    setShowCompanyApplications(false)
                    setShowCreateJobForm(true)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setCreateJobMessage('')
                      setShowCompanyProfile(false)
                      setShowCompanyJobs(false)
                      setShowCompanyApplications(false)
                      setShowCreateJobForm(true)
                    }
                  }}
                >
                  <span className="dashboard-card-icon">+</span>
                  <h2>Yeni İlan Oluştur</h2>
                  <p>Yeni bir iş veya staj ilanı yayınla.</p>
                </article>
              </div>

              {showCompanyProfile && (
                <section className="job-list-section">
                  <div className="job-list-heading">
                    <h2>Şirket Profilim</h2>

                    <div className="cv-form-actions">
                      <button
                        type="button"
                        className="logout-button"
                        onClick={openCompanyForm}
                      >
                        Profili Düzenle
                      </button>

                      <button
                        type="button"
                        className="logout-button"
                        onClick={() => {
                          setShowCompanyProfile(false)
                          setShowCompanyForm(false)
                          setCompanyFormMessage('')
                        }}
                      >
                        Kapat
                      </button>
                    </div>
                  </div>

                  {isLoadingCompany && <p>Şirket bilgileri yükleniyor...</p>}

                  {companyError && (
                    <p role="alert">{companyError}</p>
                  )}
                  {companyFormMessage && (
                    <p className="status-message" role="status">
                      {companyFormMessage}
                    </p>
                  )}

                  {showCompanyForm && (
                    <form className="cv-edit-form" onSubmit={saveCompanyProfile}>
                      <label htmlFor="company-name">Şirket adı</label>
                      <input
                        id="company-name"
                        value={companyForm.companyName}
                        onChange={(event) =>
                          setCompanyForm({
                            ...companyForm,
                            companyName: event.target.value,
                          })
                        }
                        required
                      />

                      <label htmlFor="company-sector">Sektör</label>
                      <input
                        id="company-sector"
                        value={companyForm.sector}
                        onChange={(event) =>
                          setCompanyForm({
                            ...companyForm,
                            sector: event.target.value,
                          })
                        }
                      />

                      <label htmlFor="company-city">Şehir</label>
                      <input
                        id="company-city"
                        value={companyForm.city}
                        onChange={(event) =>
                          setCompanyForm({
                            ...companyForm,
                            city: event.target.value,
                          })
                        }
                      />

                      <label htmlFor="company-website">Web sitesi</label>
                      <input
                        id="company-website"
                        type="url"
                        value={companyForm.website}
                        onChange={(event) =>
                          setCompanyForm({
                            ...companyForm,
                            website: event.target.value,
                          })
                        }
                        placeholder="https://ornek.com"
                      />

                      <label htmlFor="company-description">Şirket açıklaması</label>
                      <textarea
                        id="company-description"
                        rows={4}
                        value={companyForm.description}
                        onChange={(event) =>
                          setCompanyForm({
                            ...companyForm,
                            description: event.target.value,
                          })
                        }
                      />

                      <div className="cv-form-actions">
                        <button
                          type="submit"
                          className="login-button"
                          disabled={isSavingCompany}
                        >
                          {isSavingCompany
                            ? 'Kaydediliyor...'
                            : 'Değişiklikleri Kaydet'}
                        </button>

                        <button
                          type="button"
                          className="logout-button"
                          onClick={() => {
                            setShowCompanyForm(false)
                            setCompanyFormMessage('')
                          }}
                        >
                          Vazgeç
                        </button>
                      </div>
                    </form>
                  )}

                  {!isLoadingCompany && !companyError && companyProfile && (
                    <article className="job-list-card">
                      <h3>{companyProfile.companyName}</h3>
                      <p><strong>Sektör:</strong> {companyProfile.sector || 'Belirtilmedi'}</p>
                      <p><strong>Şehir:</strong> {companyProfile.city || 'Belirtilmedi'}</p>
                      <p><strong>Web sitesi:</strong> {companyProfile.website || 'Belirtilmedi'}</p>
                      <p><strong>Açıklama:</strong> {companyProfile.description || 'Belirtilmedi'}</p>
                      <p><strong>E-posta:</strong> {companyProfile.email}</p>
                    </article>
                  )}
                </section>
              )}

              {showCompanyJobs && (
                <section className="job-list-section">
                  <div className="job-list-heading">
                    <h2>İlanlarım</h2>
                    <button
                      type="button"
                      className="logout-button"
                      onClick={() => setShowCompanyJobs(false)}
                    >
                      Kapat
                    </button>
                  </div>
                  {deleteJobMessage && (
                    <p className="status-message" role="status">
                      {deleteJobMessage}
                    </p>
                  )}

                  {isLoadingCompanyJobs && <p>İlanların yükleniyor...</p>}

                  {companyJobsError && (
                    <p role="alert">{companyJobsError}</p>
                  )}

                  {!isLoadingCompanyJobs &&
                    !companyJobsError &&
                    companyJobPostings.length === 0 && (
                      <p>Henüz ilan yayınlamadın.</p>
                    )}

                  {!isLoadingCompanyJobs &&
                    !companyJobsError &&
                    companyJobPostings.length > 0 && (
                      <div className="job-list-grid">
                        {companyJobPostings.map((job) => (
                          <article className="job-list-card" key={job.id}>
                            <div className="job-list-card-top">
                              <div>
                                <h3>{job.title}</h3>
                                <p>{job.companyName}</p>
                              </div>
                              <span className="job-type">{job.type}</span>
                            </div>

                            <div className="job-meta">
                              <span>{job.city}</span>
                              <span>{job.workType}</span>
                            </div>

                            <p>{job.description}</p>
                            <button
                              type="button"
                              className="logout-button"
                              onClick={() => {
                                setEditingJobId(job.id)

                                setCreateJobForm({
                                  title: job.title || '',
                                  type: job.type || 'STAJ',
                                  city: job.city || '',
                                  workType: job.workType || 'HİBRİT',
                                  description: job.description || '',
                                })

                                setUpdateJobMessage('')
                                setCreateJobMessage('')
                                setShowCreateJobForm(true)
                              }}
                            >
                              Düzenle
                            </button>
                            <button
                              type="button"
                              className="logout-button"
                              disabled={deletingJobId === job.id}
                              onClick={() => deleteJobPosting(job.id)}
                            >
                              {deletingJobId === job.id ? 'Siliniyor...' : 'Sil'}
                            </button>
                          </article>
                        ))}
                      </div>
                    )}
                </section>
              )}
              {showCompanyApplications && (
                <section className="job-list-section">
                  <div className="job-list-heading">
                    <h2>İlanlarıma Gelen Başvurular</h2>

                    <button
                      type="button"
                      className="logout-button"
                      onClick={() => setShowCompanyApplications(false)}
                    >
                      Kapat
                    </button>
                  </div>
                  {companyApplicationMessage && (
                    <p className="status-message" role="status">
                      {companyApplicationMessage}
                    </p>
                  )}

                  {isLoadingCompanyApplications && (
                    <p>Başvurular yükleniyor...</p>
                  )}

                  {companyApplicationsError && (
                    <p role="alert">{companyApplicationsError}</p>
                  )}

                  {!isLoadingCompanyApplications &&
                    !companyApplicationsError &&
                    companyApplications.length === 0 && (
                      <p>İlanlarına henüz başvuru yapılmamış.</p>
                    )}

                  {!isLoadingCompanyApplications &&
                    !companyApplicationsError &&
                    companyApplications.length > 0 && (
                      <div className="job-list-grid">
                        {companyApplications.map((application) => (
                          <article
                            className="job-list-card"
                            key={application.id}
                          >
                            <div className="job-list-card-top">
                              <div>
                                <h3>{application.jobTitle}</h3>
                                <p>
                                  {application.studentFirstName} {application.studentLastName}
                                </p>
                              </div>

                              <span className="job-type">
                                {formatApplicationStatus(application.status)}
                              </span>
                            </div>

                            <p>
                              <strong>E-posta:</strong> {application.studentEmail}
                            </p>

                            <p>
                              <strong>Başvuru tarihi:</strong>{' '}
                              {application.applicationDate
                                ? new Date(
                                  application.applicationDate,
                                ).toLocaleString('tr-TR')
                                : 'Belirtilmedi'}
                            </p>
                            <label htmlFor={`application-status-${application.id}`}>
                              Başvuru durumu
                            </label>

                            <select
                              id={`application-status-${application.id}`}
                              className="application-status-select"
                              value={application.status}
                              disabled={updatingApplicationId === application.id}
                              onChange={(event) =>
                                updateCompanyApplicationStatus(
                                  application.id,
                                  event.target.value,
                                )
                              }
                            >
                              <option value="BEKLEMEDE">Beklemede</option>
                              <option value="DEĞERLENDİRİLİYOR">Değerlendiriliyor</option>
                              <option value="KABUL_EDİLDİ">Kabul edildi</option>
                              <option value="REDDEDİLDİ">Reddedildi</option>
                            </select>

                            {updatingApplicationId === application.id && (
                              <p>Başvuru durumu güncelleniyor...</p>
                            )}
                          </article>
                        ))}
                      </div>
                    )}
                </section>
              )}
              {showCreateJobForm && (
                <section className="job-list-section">
                  <div className="job-list-heading">
                    <h2>{editingJobId ? 'İlanı Düzenle' : 'Yeni İlan Oluştur'}</h2>

                    <button
                      type="button"
                      className="logout-button"
                      onClick={() => {
                        setShowCreateJobForm(false)
                        setCreateJobMessage('')
                      }}
                    >
                      Kapat
                    </button>
                  </div>

                  {createJobMessage && (
                    <p className="status-message" role="alert">
                      {createJobMessage}
                    </p>
                  )}

                  <form
                    className="cv-edit-form"
                    onSubmit={editingJobId ? saveJobChanges : createJobPosting}
                  >
                    <label htmlFor="job-title">İlan başlığı</label>
                    <input
                      id="job-title"
                      type="text"
                      value={createJobForm.title}
                      onChange={(event) =>
                        setCreateJobForm({
                          ...createJobForm,
                          title: event.target.value,
                        })
                      }
                      placeholder="Örn. Java Backend Stajyeri"
                      required
                    />

                    <label htmlFor="job-type">İlan türü</label>
                    <select
                      id="job-type"
                      value={createJobForm.type}
                      onChange={(event) =>
                        setCreateJobForm({
                          ...createJobForm,
                          type: event.target.value,
                        })
                      }
                      required
                    >
                      <option value="STAJ">Staj</option>
                      <option value="İŞ">İş</option>
                    </select>

                    <label htmlFor="job-city">Şehir</label>
                    <input
                      id="job-city"
                      type="text"
                      value={createJobForm.city}
                      onChange={(event) =>
                        setCreateJobForm({
                          ...createJobForm,
                          city: event.target.value,
                        })
                      }
                      placeholder="Örn. Çorlu"
                      required
                    />

                    <label htmlFor="job-work-type">Çalışma şekli</label>
                    <select
                      id="job-work-type"
                      value={createJobForm.workType}
                      onChange={(event) =>
                        setCreateJobForm({
                          ...createJobForm,
                          workType: event.target.value,
                        })
                      }
                      required
                    >
                      <option value="HİBRİT">Hibrit</option>
                      <option value="OFİSTEN">Ofisten</option>
                      <option value="UZAKTAN">Uzaktan</option>
                    </select>

                    <label htmlFor="job-description">İlan açıklaması</label>
                    <textarea
                      id="job-description"
                      rows={5}
                      value={createJobForm.description}
                      onChange={(event) =>
                        setCreateJobForm({
                          ...createJobForm,
                          description: event.target.value,
                        })
                      }
                      placeholder="Pozisyonu, görevleri ve aradığınız özellikleri açıklayın."
                      required
                    />

                    <div className="cv-form-actions">
                      <button
                        type="submit"
                        className="login-button"
                        disabled={editingJobId ? isUpdatingJob : isCreatingJob}
                      >
                        {editingJobId
                          ? isUpdatingJob
                            ? 'Güncelleniyor...'
                            : 'Değişiklikleri Kaydet'
                          : isCreatingJob
                            ? 'İlan kaydediliyor...'
                            : 'İlanı Yayınla'}
                      </button>

                      <button
                        type="button"
                        className="logout-button"
                        onClick={() => {
                          setShowCreateJobForm(false)
                          setCreateJobMessage('')
                          setUpdateJobMessage('')
                          setEditingJobId(null)
                        }}
                      >
                        Vazgeç
                      </button>
                    </div>
                  </form>
                </section>
              )}

              {createJobMessage && !showCreateJobForm && (
                <p className="status-message" role="status">
                  {createJobMessage}
                </p>
              )}
            </>
          ) : currentUser.role === 'ADMIN' ? (
            <section className="job-list-section">
              <div className="job-list-heading">
                <h2>Şirket Yönetimi</h2>

                <button
                  type="button"
                  className="login-button"
                  onClick={loadAdminCompanies}
                  disabled={isLoadingAdminCompanies}
                >
                  {isLoadingAdminCompanies
                    ? 'Şirketler yükleniyor...'
                    : 'Şirketleri Listele'}
                </button>
              </div>

              <p>
                Kayıtlı şirketleri inceleyebilir ve onay durumlarını
                yönetebilirsin.
              </p>

              {adminCompanyMessage && (
                <p className="status-message" role="status">
                  {adminCompanyMessage}
                </p>
              )}

              {adminCompaniesError && (
                <p role="alert">{adminCompaniesError}</p>
              )}

              {isLoadingAdminCompanies && (
                <p>Şirket kayıtları getiriliyor...</p>
              )}

              {!isLoadingAdminCompanies &&
                !adminCompaniesError &&
                adminCompanies.length === 0 && (
                  <p>Henüz listelenecek şirket bulunmuyor.</p>
                )}

              {!isLoadingAdminCompanies &&
                adminCompanies.length > 0 && (
                  <div className="job-list-grid">
                    {adminCompanies.map((company) => (
                      <article
                        className="job-list-card"
                        key={company.id}
                      >
                        <h3>{company.companyName}</h3>

                        <p>
                         <strong>E-posta:</strong> {company.userEmail}
                        </p>

                        <p>
                          <strong>Sektör:</strong>{' '}
                          {company.sector || 'Belirtilmedi'}
                        </p>

                        <p>
                          <strong>Şehir:</strong>{' '}
                          {company.city || 'Belirtilmedi'}
                        </p>

                        <p>
                          <strong>Onay durumu:</strong>{' '}
                          {company.approvalStatus === 'APPROVED'
                            ? 'Onaylandı'
                            : company.approvalStatus === 'REJECTED'
                              ? 'Reddedildi'
                              : 'Beklemede'}
                        </p>

                        {(company.approvalStatus === 'PENDING' ||
                          !company.approvalStatus) && (
                            <div className="cv-form-actions">
                              <button
                                type="button"
                                className="login-button"
                                disabled={
                                  updatingAdminCompanyId === company.id
                                }
                                onClick={() =>
                                  updateAdminCompanyApproval(
                                    company.id,
                                    'APPROVED',
                                  )
                                }
                              >
                                Onayla
                              </button>

                              <button
                                type="button"
                                className="logout-button"
                                disabled={
                                  updatingAdminCompanyId === company.id
                                }
                                onClick={() =>
                                  updateAdminCompanyApproval(
                                    company.id,
                                    'REJECTED',
                                  )
                                }
                              >
                                Reddet
                              </button>
                            </div>
                          )}
                      </article>
                    ))}
                  </div>
                )}
            </section>
          ) : (
            <div className="dashboard-placeholder">
              <h2>{roleTitle} hazırlanıyor</h2>
              <p>
                Bu paneli kullanıcı rolüne uygun özelliklerle
                sonraki adımda geliştireceğiz.
              </p>
            </div>
          )}
        </section>
      </main>
    )
  }

  // Giriş ekranı
  return (
    <main className="auth-page">
      <section className="welcome-panel">
        <a
          className="brand"
          href="/"
          onClick={(event) => event.preventDefault()}
        >
          <span className="brand-icon">C</span>
          <span>
            Career<span className="brand-light">Hub</span>
          </span>
        </a>

        <div className="welcome-content">
          <span className="eyebrow">GELECEĞİNİ KEŞFET</span>

          <h1>
            Hayalindeki kariyere
            <br />
            bir adım daha yakınsın.
          </h1>

          <p>
            Staj fırsatlarını keşfet, yeteneklerini geliştir ve
            kariyer yolculuğunu tek bir yerden yönet.
          </p>

          <div className="feature-list">
            <div className="feature">
              <span className="feature-icon">↗</span>
              <div>
                <strong>Yeni fırsatları keşfet</strong>
                <span>Sana uygun staj ve iş ilanlarını bul.</span>
              </div>
            </div>

            <div className="feature">
              <span className="feature-icon">✓</span>
              <div>
                <strong>Kariyerini yönet</strong>
                <span>Başvurularını ve CV'ni tek yerde tut.</span>
              </div>
            </div>
          </div>
        </div>

        <p className="panel-footer">
          Geleceğini bugün şekillendirmeye başla.
        </p>
      </section>

      <section className="form-panel">
        <div className="login-card">
          <span className="form-eyebrow">TEKRAR HOŞ GELDİN</span>

          <h2>Hesabına giriş yap</h2>

          <p className="form-description">
            Devam etmek için hesap bilgilerini gir.
          </p>

          <form onSubmit={handleSubmit} hidden={showRegisterForm}>
            <label htmlFor="email">E-posta adresi</label>

            <input
              id="email"
              type="email"
              placeholder="ornek@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />

            <label htmlFor="password">Şifre</label>

            <div className="password-field">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Şifreni gir"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                className="show-password"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Gizle' : 'Göster'}
              </button>
            </div>

            <button
              className="login-button"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              <span>→</span>
            </button>

            {message && (
              <p className="status-message" role="status">
                {message}
              </p>
            )}
          </form>
          <button
            type="button"
            className="logout-button"
            onClick={() => {
              setShowRegisterForm((previous) => !previous)
              setRegisterMessage('')
            }}
          >
            {showRegisterForm ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>

          {registerMessage && (
            <p className="status-message" role="status">
              {registerMessage}
            </p>
          )}

          {showRegisterForm && (
            <form className="cv-edit-form" onSubmit={registerUser}>
              <h2>Yeni Hesap Oluştur</h2>

              <label htmlFor="register-first-name">Ad</label>
              <input
                id="register-first-name"
                type="text"
                value={registerForm.firstName}
                onChange={(event) =>
                  setRegisterForm((previous) => ({
                    ...previous,
                    firstName: event.target.value,
                  }))
                }
                required
              />

              <label htmlFor="register-last-name">Soyad</label>
              <input
                id="register-last-name"
                type="text"
                value={registerForm.lastName}
                onChange={(event) =>
                  setRegisterForm((previous) => ({
                    ...previous,
                    lastName: event.target.value,
                  }))
                }
                required
              />

              <label htmlFor="register-email">E-posta</label>
              <input
                id="register-email"
                type="email"
                value={registerForm.email}
                onChange={(event) =>
                  setRegisterForm((previous) => ({
                    ...previous,
                    email: event.target.value,
                  }))
                }
                autoComplete="email"
                required
              />

              <label htmlFor="register-password">Şifre</label>
              <input
                id="register-password"
                type="password"
                value={registerForm.password}
                onChange={(event) =>
                  setRegisterForm((previous) => ({
                    ...previous,
                    password: event.target.value,
                  }))
                }
                autoComplete="new-password"
                required
              />

              <label htmlFor="register-role">Hesap türü</label>
              <select
                id="register-role"
                value={registerForm.role}
                onChange={(event) =>
                  setRegisterForm((previous) => ({
                    ...previous,
                    role: event.target.value,
                  }))
                }
                required
              >
                <option value="STUDENT">Öğrenci</option>
                <option value="COMPANY">Şirket</option>
              </select>

              <button
                type="submit"
                className="login-button"
                disabled={isRegistering}
              >
                {isRegistering
                  ? 'Hesap oluşturuluyor...'
                  : 'Hesap Oluştur'}
              </button>
            </form>
          )}

          <div className="account-note">
            <span className="note-icon">✦</span>
            <p>
              Öğrenci veya şirket hesabınla kariyer fırsatlarına
              tek bir yerden ulaş.
            </p>
          </div>

          <p className="security-note">
            Güvenli kariyer yolculuğun burada başlıyor.
          </p>
        </div>
      </section>
    </main>
  )
}

export default App
