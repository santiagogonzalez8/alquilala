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
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [uploading, setUploading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false)

  useEffect(() => { loadUserData() }, [])

  const loadUserData = async () => {
    if (!auth.currentUser) return
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid))
      if (userDoc.exists()) {
        setUserData(userDoc.data())
      } else {
        const initial = {
          displayName: auth.currentUser.displayName || '',
          email: auth.currentUser.email || '',
          phone: '', location: '', bio: '',
          photoURL: auth.currentUser.photoURL || ''
        }
        setUserData(initial)
        await setDoc(doc(db, 'users', auth.currentUser.uid), initial)
      }
    } catch (error) { console.error('Error:', error) }
  }

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { alert('La imagen debe ser menor a 2MB'); return }
    setUploading(true)
    try {
      const storageRef = ref(storage, `profile-photos/${auth.currentUser.uid}`)
      await uploadBytes(storageRef, file)
      const photoURL = await getDownloadURL(storageRef)
      await updateProfile(auth.currentUser, { photoURL })
      const newData = { ...userData, photoURL }
      setUserData(newData)
      await updateDoc(doc(db, 'users', auth.currentUser.uid), { photoURL, updatedAt: new Date() })
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) { alert('Error al subir la foto') }
    setUploading(false)
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    try {
      await updateProfile(auth.currentUser, { displayName: userData.displayName })
      await updateDoc(doc(db, 'users', auth.currentUser.uid), { ...userData, updatedAt: new Date() })
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      await loadUserData()
    } catch (error) { alert('Error al guardar') }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (newPassword.length < 6) { alert('Mínimo 6 caracteres'); return }
    if (newPassword !== confirmPassword) { alert('Las contraseñas no coinciden'); return }
    try {
      await updatePassword(auth.currentUser, newPassword)
      setShowPasswordSuccess(true)
      setTimeout(() => setShowPasswordSuccess(false), 3000)
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) { alert('Error. Volvé a iniciar sesión.') }
  }

  const getInitials = () => userData.displayName ? userData.displayName.charAt(0).toUpperCase() : 'U'

  return (
    <div className={styles.page}>
      {(showSuccess || showPasswordSuccess) && (
        <div className={styles.toast}>
          ✅ {showPasswordSuccess ? 'Contraseña actualizada' : 'Perfil actualizado correctamente'}
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
              {uploading ? 'Subiendo...' : 'Cambiar foto'}
            </label>
            <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
            <p className={styles.hint}>400×400px, máx 2MB</p>
          </div>
        </div>

        {/* Info */}
        <div className={styles.section}>
          <h3>Información Personal</h3>
          <form onSubmit={handleSaveProfile}>
            <div className={styles.formGroup}>
              <label>Nombre completo *</label>
              <input type="text" name="displayName" value={userData.displayName} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Correo electrónico</label>
              <input type="email" value={userData.email} disabled />
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
            <button type="submit" className={styles.btnSave}>Guardar Cambios</button>
          </form>
        </div>

        {/* Password */}
        <div className={styles.section}>
          <h3>Cambiar Contraseña</h3>
          <form onSubmit={handleChangePassword}>
            <div className={styles.formGroup}>
              <label>Nueva contraseña</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
            </div>
            <div className={styles.formGroup}>
              <label>Confirmar contraseña</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repetí la contraseña" />
            </div>
            <button type="submit" className={styles.btnSave}>Cambiar Contraseña</button>
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