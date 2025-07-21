import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ showModal, setShowModal }) => {
  if (!showModal) return null;

  return (
    <div className="fixed left-0 top-0 w-1/2 h-full bg-white shadow-2xl border-r border-gray-200 z-50 flex flex-col">
      {/* 模态框头部 */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
        <h2 className="text-xl font-bold text-gray-900">{showModal.label}</h2>
        <button
          onClick={() => setShowModal(null)}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          title="Close"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>
      
      {/* 可滚动内容区域 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="text-sm text-gray-700 leading-relaxed">{showModal.content}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;