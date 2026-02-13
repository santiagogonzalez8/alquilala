'use client'

import { useState, useEffect } from 'react'
import { auth, db, storage } from '@/lib/firebase'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { updatePassword, updateProfile } from 'firebase/auth'
import ProtectedRoute from '@/components/ProtectedRoute'
import styles from './perfil.module.css'

function PerfilContenido() {
  const [userData, setUserData] = useState({
    displayName: '', email: '', phone: '', location: '', bio: '', photoURL: ''
  })
  const [originalData, setOriginalData] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [toast, setToast] = useState('')
  const [toastType, setToastType] = useState('success')

  useEffect(() => { loadUserData() }, [])

  const showToast = (msg, type = 'success') => {
    setToast(msg)
    setToastType(type)
    setTimeout(() => setToast(''), 4000)
  }

  const loadUserData = async () => {
    if (!auth.currentUser) return
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid)
      const userDoc = await getDoc(userRef)
      if (userDoc.exists()) {
        const data = userDoc.data()
        setUserData(data)
        setOriginalData(data)
      } else {
        const initial = {
          displayName: auth.currentUser.displayName || '',
          email: auth.currentUser.email || '',
          phone: '', location: '', bio: '',
          photoURL: auth.currentUser.photoURL || ''
        }
        setUserData(initial)
        setOriginalData(initial)
        await setDoc(userRef, { ...initial, createdAt: new Date() })
      }
    } catch (error) {
      console.error('Error cargando perfil:', error)
      showToast('Error al cargar el perfil', 'error')
    }
  }

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      showToast('La imagen debe ser menor a 2MB', 'error')
      return
    }

    setUploading(true)
    try {
      const storageRef = ref(storage, `profile-photos/${auth.currentUser.uid}_${Date.now()}`)
      await uploadBytes(storageRef, file)
      const photoURL = await getDownloadURL(storageRef)

      // Actualizar en Firebase Auth
      await updateProfile(auth.currentUser, { photoURL })

      // Actualizar en Firestore
      const userRef = doc(db, 'users', auth.currentUser.uid)
      const userDoc = await getDoc(userRef)
      if (userDoc.exists()) {
        await updateDoc(userRef, { photoURL, updatedAt: new Date() })
      } else {
        await setDoc(userRef, { ...userData, photoURL, updatedAt: new Date() })
      }

      setUserData(prev => ({ ...prev, photoURL }))
      showToast('✅ Foto actualizada correctamente')
    } catch (error) {
      console.error('Error subiendo foto:', error)
      showToast('Error al subir la foto. Verificá las reglas de Firebase Storage.', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Actualizar displayName en Firebase Auth
      if (userData.displayName !== auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, { displayName: userData.displayName })
      }

      // Guardar en Firestore
      const userRef = doc(db, 'users', auth.currentUser.uid)
      const dataToSave = {
        displayName: userData.displayName,
        email: userData.email,
        phone: userData.phone || '',
        location: userData.location || '',
        bio: userData.bio || '',
        photoURL: userData.photoURL || '',
        updatedAt: new Date()
      }

      const userDoc = await getDoc(userRef)
      if (userDoc.exists()) {
        await updateDoc(userRef, dataToSave)
      } else {
        await setDoc(userRef, { ...dataToSave, createdAt: new Date() })
      }

      setOriginalData({ ...userData })
      showToast('✅ Perfil guardado correctamente')
    } catch (error) {
      console.error('Error guardando perfil:', error)
      showToast('Error al guardar. Intentá de nuevo.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (newPassword.length < 6) { showToast('Mínimo 6 caracteres', 'error'); return }
    if (newPassword !== confirmPassword) { showToast('Las contraseñas no coinciden', 'error'); return }

    setSavingPassword(true)
    try {
      await updatePassword(auth.currentUser, newPassword)
      showToast('✅ Contraseña actualizada')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.error('Error:', error)
      if (error.code === 'auth/requires-recent-login') {
        showToast('Por seguridad, cerrá sesión y volvé a iniciar antes de cambiar la contraseña.', 'error')
      } else {
        showToast('Error al cambiar contraseña', 'error')
      }
    } finally {
      setSavingPassword(false)
    }
  }

  const getInitials = () => userData.displayName ? userData.displayName.charAt(0).toUpperCase() : 'U'

  return (
    <div className={styles.page}>
      {toast && (
        <div className={styles.toast} style={{
          background: toastType === 'error' ? 'var(--color-danger)' : 'var(--color-success)'
        }}>
          {toast}
        </div>
      )}

      <div className={styles.header}>
        <div className={styles.headerContent}>
          <span className="section-label">Mi cuenta</span>
          <h1 className={styles.headerTitle}>Mi Perfil</h1>
        </div>
      </div>

      <div className={styles.container}>
        {/* Foto */}
        <div className={styles.photoSection}>
          <div className={styles.photo}>
            {userData.photoURL ? (
              <img src={userData.photoURL} alt="Perfil" />
            ) : (
              <div className={styles.initials}>{getInitials()}</div>
            )}
          </div>
          <div>
            <label htmlFor="photo-upload" className={styles.btnPhoto}>
              {uploading ? '⏳ Subiendo...' : '📷 Cambiar foto'}
            </label>
            <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploading} style={{ display: 'none' }} />
            <p className={styles.hint}>JPG o PNG, máx 2MB</p>
          </div>
        </div>

        {/* Info */}
        <div className={styles.section}>
          <h3>Información Personal</h3>
          <form onSubmit={handleSaveProfile}>
            <div className={styles.formGroup}>
              <label>Nombre completo *</label>
              <input type="text" name="displayName" value={userData.displayName} onChange={handleChange} required placeholder="Tu nombre" />
            </div>
            <div className={styles.formGroup}>
              <label>Correo electrónico</label>
              <input type="email" value={userData.email} disabled />
              <p className={styles.hint}>El email no se puede cambiar</p>
            </div>
            <div className={styles.formGroup}>
              <label>Teléfono</label>
              <input type="tel" name="phone" value={userData.phone} onChange={handleChange} placeholder="+598 99 123 456" />
            </div>
            <div className={styles.formGroup}>
              <label>Ubicación</label>
              <input type="text" name="location" value={userData.location} onChange={handleChange} placeholder="Montevideo, Uruguay" />
            </div>
            <div className={styles.formGroup}>
              <label>Sobre mí</label>
              <textarea name="bio" value={userData.bio} onChange={handleChange} rows="4" placeholder="Contanos sobre vos..." />
            </div>
            <button type="submit" className={styles.btnSave} disabled={saving}>
              {saving ? '⏳ Guardando...' : '💾 Guardar Cambios'}
            </button>
          </form>
        </div>

        {/* Password */}
        <div className={styles.section}>
          <h3>Cambiar Contraseña</h3>
          <p className={styles.hint} style={{ marginBottom: '1rem' }}>
            Solo disponible si te registraste con email y contraseña (no con Google).
          </p>
          <form onSubmit={handleChangePassword}>
            <div className={styles.formGroup}>
              <label>Nueva contraseña</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
            </div>
            <div className={styles.formGroup}>
              <label>Confirmar contraseña</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repetí la contraseña" />
            </div>
            <button type="submit" className={styles.btnSave} disabled={savingPassword}>
              {savingPassword ? '⏳ Cambiando...' : '🔒 Cambiar Contraseña'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function Perfil() {
  return (
    <ProtectedRoute>
      <PerfilContenido />
    </ProtectedRoute>
  )
}