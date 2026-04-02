import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, Check, AlertCircle, Award } from 'lucide-react'

const CertificateUpload = ({ onCertificatesChange }) => {
  const [certificates, setCertificates] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const certificateTypes = {
    'NPTEL Elite': { marks: 5, description: '5 marks' },
    'NPTEL Silver': { marks: 10, description: '10 marks' },
    'NPTEL Gold': { marks: 20, description: '20 marks' },
    'NPTEL Advanced Gold': { marks: 30, description: '30 marks (Advanced course)' },
    'Wipro Future Skills': { marks: 10, description: '10 marks' },
    'International Certificate': { marks: 10, description: '10 marks' },
    'Hacktoberfest': { marks: 10, description: '10 marks (Completed 4 PR badge)' },
    'GSoC/GSSOC': { marks: 10, description: '10 marks (Contributor badge)' },
    'Other': { marks: 0, description: 'Add file for reference' },
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
  }

  const handleFileSelect = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
  }

  // Smart auto-detection function with keyword matching
  const detectCertificateType = (fileName) => {
    const cleaned = fileName.toLowerCase().replace(/[@_\-\s\d]/g, '').replace('.pdf', '').replace('.jpg', '').replace('.jpeg', '').replace('.png', '')
    
    // Pattern matching: ordered by specificity (more specific first)
    const patterns = {
      'NPTEL Advanced Gold': ['advancedgold', 'npteleadvancegold', 'npteladvanced'],
      'NPTEL Gold': ['nptelgold', 'gold'],
      'NPTEL Silver': ['nptelsilver', 'silver'],
      'NPTEL Elite': ['nptelelit', 'elite'],
      'Wipro Future Skills': ['wipro', 'futureskills', 'wfs'],
      'Hacktoberfest': ['hacktober'],
      'GSoC/GSSOC': ['gsoc', 'gssoc'],
      'International Certificate': ['international'],
    }
    
    // Check patterns in order
    for (const [certType, keywords] of Object.entries(patterns)) {
      for (const keyword of keywords) {
        if (cleaned.includes(keyword)) {
          return certType
        }
      }
    }
    
    // Fallback: if filename contains known keywords, match them
    if (cleaned.includes('nptel')) return 'NPTEL Gold' // Default NPTEL to Gold if no tier specified
    if (cleaned.includes('wipro')) return 'Wipro Future Skills'
    if (cleaned.includes('hacktober')) return 'Hacktoberfest'
    if (cleaned.includes('gsoc')) return 'GSoC/GSSOC'
    
    return 'Other'
  }

  const handleFiles = async (files) => {
    setUploading(true)
    setError(null)

    const newCerts = []
    let totalMarks = 0

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type (images + PDF)
      if (!['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'].includes(file.type)) {
        setError('Please upload PNG, JPG, or PDF files only')
        setUploading(false)
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        setUploading(false)
        return
      }

      // Create file object with analysis
      const certObj = {
        id: Date.now() + i,
        fileName: file.name,
        file: file,
        type: 'Other',
        marks: 0,
        uploadedAt: new Date().toLocaleString(),
      }

      // Auto-detect certificate type using smart detection
      const detectedType = detectCertificateType(file.name)
      certObj.type = detectedType
      certObj.marks = certificateTypes[detectedType].marks

      newCerts.push(certObj)
      totalMarks += certObj.marks
    }

    const updatedCerts = [...certificates, ...newCerts]
    setCertificates(updatedCerts)
    setUploading(false)

    // Notify parent component
    if (onCertificatesChange) {
      onCertificatesChange(updatedCerts, totalMarks)
    }
  }

  const handleTypeChange = (certId, newType) => {
    const updatedCerts = certificates.map(cert => {
      if (cert.id === certId) {
        return {
          ...cert,
          type: newType,
          marks: certificateTypes[newType].marks,
        }
      }
      return cert
    })

    setCertificates(updatedCerts)

    // Recalculate total marks
    const totalMarks = updatedCerts.reduce((sum, cert) => sum + cert.marks, 0)

    if (onCertificatesChange) {
      onCertificatesChange(updatedCerts, totalMarks)
    }
  }

  const handleRemove = (certId) => {
    const updatedCerts = certificates.filter(cert => cert.id !== certId)
    setCertificates(updatedCerts)

    const totalMarks = updatedCerts.reduce((sum, cert) => sum + cert.marks, 0)
    if (onCertificatesChange) {
      onCertificatesChange(updatedCerts, totalMarks)
    }
  }

  const totalMarks = certificates.reduce((sum, cert) => sum + cert.marks, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-slate-100 mb-2 flex items-center gap-2">
          <Award size={20} className="text-brand-blue" />
          Certificate Upload (Checkpoint 4)
        </h3>
        <p className="text-sm text-slate-400">
          Upload your certificates to automatically add marks. Minimum 2 certificates required for eligibility.
        </p>
      </div>

      {/* Upload Zone */}
      <motion.div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative p-8 rounded-lg border-2 border-dashed transition-all duration-300 cursor-pointer ${
          dragActive
            ? 'border-brand-blue bg-brand-blue/10'
            : 'border-slate-600 hover:border-slate-500 bg-slate-900/30'
        }`}
      >
        <input
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.pdf"
          onChange={handleFileSelect}
          disabled={uploading}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />

        <div className="text-center">
          <motion.div
            animate={{ y: dragActive ? -5 : 0 }}
            className="mb-4 flex justify-center"
          >
            <Upload size={40} className="text-slate-400" />
          </motion.div>
          <p className="text-slate-300 font-medium">Drag certificates here or click to browse</p>
          <p className="text-xs text-slate-500 mt-2">PNG, JPG, or PDF (Max 5MB each)</p>
        </div>

        {uploading && (
          <div className="absolute inset-0 bg-slate-900/50 rounded-lg flex items-center justify-center">
            <div className="flex items-center gap-2 text-slate-300">
              <div className="animate-spin h-4 w-4 border-2 border-brand-blue border-t-transparent rounded-full"></div>
              Uploading...
            </div>
          </div>
        )}
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm flex items-center gap-2"
        >
          <AlertCircle size={18} />
          {error}
        </motion.div>
      )}

      {/* Uploaded Certificates List */}
      {certificates.length > 0 && (
        <motion.div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-300">
              Uploaded Certificates ({certificates.length})
            </h4>
            {totalMarks > 0 && (
              <div className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-green-300 text-xs font-semibold">
                +{totalMarks} marks
              </div>
            )}
          </div>

          <div className="space-y-2">
            {certificates.map((cert, idx) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-200 truncate">{cert.fileName}</p>
                    <p className="text-xs text-slate-500 mt-1">Uploaded: {cert.uploadedAt}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemove(cert.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-all"
                  >
                    <X size={18} />
                  </motion.button>
                </div>

                {/* Certificate Type Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block">Certificate Type</label>
                    <select
                      value={cert.type}
                      onChange={(e) => handleTypeChange(cert.id, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-sm text-white cursor-pointer appearance-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 8px center',
                        paddingRight: '28px',
                      }}
                    >
                      {Object.entries(certificateTypes).map(([type, data]) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block">Marks Awarded</label>
                    <div className="px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-sm font-semibold text-green-400 flex items-center gap-2">
                      <Check size={16} className="text-green-500" />
                      +{cert.marks} marks
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500">
                  {certificateTypes[cert.type].description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Certificate Type Reference */}
      {certificates.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-slate-800/30 border border-slate-700/30 rounded-lg"
        >
          <p className="text-xs font-semibold text-slate-300 mb-3">Supported Certificate Types:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(certificateTypes)
              .filter(([type]) => type !== 'Other')
              .map(([type, data]) => (
                <div key={type} className="text-xs text-slate-400">
                  <span className="text-slate-300 font-medium">{type}:</span> {data.description}
                </div>
              ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default CertificateUpload
