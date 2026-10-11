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
  const [updatingApplicationId, setUpdatingApplicationId] = useState(null)
  const [companyApplicationMessage, setCompanyApplicationMessage] = useState('')

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
              </div>

              {showCompanyProfile && (
                <section className="job-list-section">
                  <div className="job-list-heading">
                    <h2>Şirket Profilim</h2>
                    <button
                      type="button"
                      className="logout-button"
                      onClick={() => setShowCompanyProfile(false)}
                    >
                      Kapat
                    </button>
                  </div>

                  {isLoadingCompany && <p>Şirket bilgileri yükleniyor...</p>}

                  {companyError && (
                    <p role="alert">{companyError}</p>
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
            </>
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

          <form onSubmit={handleSubmit}>
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
