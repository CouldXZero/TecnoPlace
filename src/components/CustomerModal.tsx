import React, { useState } from 'react';
import {
  X,
  UserPlus,
  LogIn,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  User,
  Mail,
  Lock,
  Phone,
  FileText,
  MapPin,
  Building,
  UserCheck
} from 'lucide-react';
import { Customer } from '../types';
import { saveCustomerToFirestore } from '../services/firebaseStore';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerSaved?: (customer: Customer) => void;
  existingCustomers?: Customer[];
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  onCustomerSaved,
  existingCustomers = []
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');

  // Form Field States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cedulaOrRuc, setCedulaOrRuc] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');

  // Notification / Error State
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Clear all form inputs
  const handleResetFormFields = () => {
    setName('');
    setEmail('');
    setPhone('');
    setCedulaOrRuc('');
    setAddress('');
    setCity('');
    setPassword('');
    setShowErrorModal(false);
    setErrorMessage('');
  };

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (activeTab === 'login') {
      // Validate login credentials
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      if (!cleanEmail || !cleanPassword || !cleanEmail.includes('@') || cleanPassword.length < 4) {
        setErrorMessage('Correo electrónico o contraseña con formato incorrecto.');
        setShowErrorModal(true);
        setIsSubmitting(false);
        return;
      }

      // Check against existing customers
      const foundCustomer = existingCustomers.find(
        (c) => c.email.toLowerCase() === cleanEmail && (c.password ? c.password === cleanPassword : true)
      );

      if (!foundCustomer) {
        setErrorMessage('Credenciales incorrectas. El usuario o la contraseña no coinciden con nuestros registros.');
        setShowErrorModal(true);
        setIsSubmitting(false);
        return;
      }

      // Success Login
      setIsSubmitting(false);
      setShowSuccessModal(true);
      if (onCustomerSaved) onCustomerSaved(foundCustomer);

    } else {
      // Register Mode Validation
      const cleanName = name.trim();
      const cleanEmail = email.trim().toLowerCase();
      const cleanPhone = phone.trim();
      const cleanCedula = cedulaOrRuc.trim();
      const cleanAddress = address.trim();
      const cleanCity = city.trim();
      const cleanPassword = password.trim();

      // Check for empty or invalid fields
      if (
        !cleanName ||
        !cleanEmail ||
        !cleanEmail.includes('@') ||
        !cleanPhone ||
        !cleanCedula ||
        !cleanPassword ||
        cleanPassword.length < 5
      ) {
        setErrorMessage('Uno o más campos de registro están vacíos o contienen información incorrecta.');
        setShowErrorModal(true);
        setIsSubmitting(false);
        return;
      }

      // Create new customer record
      const newCustomer: Customer = {
        id: `cust-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        cedulaOrRuc: cleanCedula,
        address: cleanAddress || 'Dirección Principal',
        city: cleanCity || 'Quito',
        password: cleanPassword,
        createdAt: new Date().toISOString(),
        status: 'active',
        totalOrders: 0
      };

      try {
        // Save to Firebase Firestore database!
        await saveCustomerToFirestore(newCustomer);
        setIsSubmitting(false);
        setShowSuccessModal(true);
        if (onCustomerSaved) onCustomerSaved(newCustomer);
      } catch (err) {
        console.error('Error saving customer to Firestore:', err);
        setErrorMessage('Ocurrió un error al guardar el cliente en la base de datos.');
        setShowErrorModal(true);
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* Header Modal */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Registro de Cliente en Base de Datos</h3>
              <p className="text-xs text-slate-400">Plataforma TecnoPlace - Almacenamiento seguro en Firebase</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-2 gap-2">
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'register'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Registrar Nuevo Cliente</span>
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'login'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Iniciar Sesión</span>
          </button>
        </div>

        {/* Main Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {activeTab === 'register' ? (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Nombre Completo del Cliente *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Carlos Mendoza"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>Correo Electrónico *</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="cliente@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Teléfono / WhatsApp *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+593 99 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  />
                </div>
              </div>

              {/* Cédula/RUC & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>Cédula / RUC *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="1723456789"
                    value={cedulaOrRuc}
                    onChange={(e) => setCedulaOrRuc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Contraseña *</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  />
                </div>
              </div>

              {/* Address & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>Dirección de Entrega</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Av. Principal #123"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-blue-600" />
                    <span>Ciudad</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Quito / Guayaquil"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Login Fields */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span>Correo Electrónico *</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="tuemail@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Contraseña *</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Tu contraseña de acceso"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                />
              </div>
            </>
          )}

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Guardando cliente en Firestore...</span>
              ) : activeTab === 'register' ? (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Guardar Cliente en la Base de Datos</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Acceder a mi Cuenta</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Security Badge */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encriptación SSL de 256 bits</span>
          </div>
          <span className="text-slate-400">Firebase Cloud Database</span>
        </div>

      </div>

      {/* ERROR NOTIFICATION MODAL WITH "VOLVER A INTENTAR" BUTTON THAT CLEARS ALL FIELDS */}
      {showErrorModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border-2 border-rose-500 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl mx-auto flex items-center justify-center shadow-inner">
              <AlertTriangle className="w-9 h-9" />
            </div>

            <div>
              <h4 className="text-xl font-black text-slate-900 mb-1.5">
                Campos o Credenciales Incorrectos
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {errorMessage || 'Ha ocurrido un error con los datos ingresados. Por favor verifica que la información sea correcta.'}
              </p>
            </div>

            <button
              onClick={handleResetFormFields}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-3.5 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-5 h-5 animate-spin-once" />
              <span>Volver a intentar</span>
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border-2 border-emerald-500 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h4 className="text-xl font-black text-slate-900 mb-1.5">
                ¡Cliente Guardado con Éxito!
              </h4>
              <p className="text-sm text-slate-600">
                La información del cliente fue registrada correctamente en la base de datos de Firebase Firestore.
              </p>
            </div>

            <button
              onClick={() => {
                setShowSuccessModal(false);
                onClose();
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-2xl shadow-md transition-all cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
