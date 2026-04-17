import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, Check, AlertCircle, Award, Info } from 'lucide-react'

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
        <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Award size={20} className="text-blue-700" />
          Certificate Upload
        </h3>
        <p className="text-sm text-slate-500 font-medium">
          Upload your certificates to automatically add marks. Minimum 2 certificates required for eligibility.
        </p>
      </div>

      {/* Upload Zone */}
      <motion.div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative p-8 rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer flex flex-col items-center justify-center min-h-[160px] ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 hover:border-blue-400 bg-slate-50/50'
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
            <div className={`p-4 rounded-full ${dragActive ? 'bg-blue-100 text-blue-600' : 'bg-white shadow-sm text-slate-400'}`}>
              <Upload size={32} />
            </div>
          </motion.div>
          <p className="text-slate-700 font-semibold text-sm">Drag certificates here or click to browse</p>
          <p className="text-xs text-slate-500 mt-2">PNG, JPG, or PDF (Max 5MB each)</p>
        </div>

        {uploading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3 text-blue-700 font-medium">
              <div className="animate-spin h-8 w-8 border-4 border-blue-200 border-t-blue-700 rounded-full"></div>
              Uploading...
            </div>
          </div>
        )}
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium flex items-center gap-2"
        >
          <AlertCircle size={18} />
          {error}
        </motion.div>
      )}

      {/* Uploaded Certificates List */}
      {certificates.length > 0 && (
        <motion.div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-700">
              Uploaded Certificates ({certificates.length})
            </h4>
            {totalMarks > 0 && (
              <div className="px-3 py-1 bg-green-100 border border-green-200 rounded-full text-green-700 text-xs font-bold shadow-sm">
                +{totalMarks} marks
              </div>
            )}
          </div>

          <div className="space-y-3">
            {certificates.map((cert, idx) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800 truncate">{cert.fileName}</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Uploaded: {cert.uploadedAt}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemove(cert.id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-all"
                  >
                    <X size={18} />
                  </motion.button>
                </div>

                {/* Certificate Type Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Certificate Type</label>
                    <select
                      value={cert.type}
                      onChange={(e) => handleTypeChange(cert.id, e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-sm text-slate-800 font-medium cursor-pointer appearance-none hover:border-blue-400 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23475569' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                        paddingRight: '36px',
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
                    <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Marks Awarded</label>
                    <div className="px-4 py-2.5 rounded-lg bg-green-50 border border-green-200 text-sm font-bold text-green-700 flex items-center gap-2 shadow-sm">
                      <Check size={16} className="text-green-600" />
                      +{cert.marks} marks
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 font-medium bg-slate-50 inline-block px-2 py-1 rounded">
                  <span className="text-slate-700">Note:</span> {certificateTypes[cert.type].description}
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
          className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl"
        >
          <p className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2">
            <Info size={16} className="text-blue-600" />
            Supported Certificate Types
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
            {Object.entries(certificateTypes)
              .filter(([type]) => type !== 'Other')
              .map(([type, data]) => (
                <div key={type} className="text-xs">
                  <span className="text-slate-800 font-bold bg-slate-100 px-2 py-0.5 rounded leading-relaxed">{type}</span>
                  <span className="text-slate-500 font-medium ml-2 block mt-1">{data.description}</span>
                </div>
              ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default CertificateUpload
