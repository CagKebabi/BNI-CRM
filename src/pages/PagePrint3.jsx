import React, { useState, useEffect } from 'react';
import bniLogo from '../assets/bni-logo_brandlogos.net_vdxgj.png';
import { groupMembersService } from '../services/groupMembers.service';
import './PagePrint.css';
import { useGroup } from '../contexts/GroupContext';

const PagePrint3 = () => {  
  const { selectedGroupContext } = useGroup();
  const [groupMembers, setGroupMembers] = useState([]);

  useEffect(() => {
    fetchGroupMembers();
    console.log("selectedGroupContext", selectedGroupContext);
    console.log("groupMembers", groupMembers);
  }, []);

  const fetchGroupMembers = async () => {
    const groupMembers = await groupMembersService.getGroupMembers(selectedGroupContext?.id);
    setGroupMembers(groupMembers);
  }

  const handlePrint = () => {
    window.print();
  }

  return (
    <>
      {/* Yazdırma butonu - sadece ekranda görünür */}
      <div className="print:hidden flex justify-center autoFix">
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          Yazdır (A4)
        </button>
      </div>

      {/* A4 Sayfalar Konteyner */}
      <div className="flex flex-col gap-0">
        {/* İkinci Sayfa */}
        <div className="flex justify-center">
          <div className="a4-page">
            <div className='a4-content pb-[50px] autoFix'>
              {/* İkinci sayfa içeriği */}
              <div className='pl-[20px] pr-[20px] autoFix'>
                <div className='text-[12px] gap-2 font-bold h-[63px] flex items-center autoFix'>
                  <img className='w-[90px]' src={bniLogo} alt="" />
                  <div>
                    <div className='flex items-start flex-col flex-grow'>
                        <div className='text-sm font-bold'>Türkiye/İstanbul</div>
                        <div className='text-sm font-bold'>{`BNI ${selectedGroupContext?.name} Her ${selectedGroupContext?.meeting_day} - ${selectedGroupContext?.start_time} - ${selectedGroupContext?.end_time} Arası`}</div>
                    </div>
                  </div>
                </div>
                <div>
                <table className="w-full border-collapse mt-4 autoFix">
                    <thead>
                      <tr>
                        <th className="border bg-black/20 border-black/70 text-[11px] text-center text-[#C80F2E] autoFix font-bold p-1">Sıra</th>
                        <th className="border bg-black/20 border-black/70 text-[11px] text-center text-[#C80F2E] autoFix font-bold p-1">Ad Soyad</th>
                        <th className="border bg-black/20 border-black/70 text-[11px] text-center text-[#C80F2E] autoFix font-bold p-1">Kategori</th>
                        <th className="border bg-black/20 border-black/70 text-[11px] text-center text-[#C80F2E] autoFix font-bold p-1">Firma</th>
                        <th className="border bg-black/20 border-black/70 text-[11px] text-center text-[#C80F2E] autoFix font-bold p-1">Saat</th>
                        <th className="border bg-black/20 border-black/70 text-[11px] text-center text-[#C80F2E] autoFix font-bold p-1">İmza</th>
                      </tr>
                    </thead>
                    <tbody className='text-[9px]'>
                      {groupMembers?.members?.map((user, index) => (
                        <tr key={user.id} className={index % 2 === 0 ? "bg-white" : "bg-black/20"}>
                          <td className="p-1 border border-black/70 autoFix font-bold text-center">{index + 1}</td>
                          <td className="p-1 border border-black/70 autoFix">{user.first_name} {user.last_name}</td>
                          <td className='p-1 border border-black/70 autoFix'>{user.category}</td>
                          <td className='p-1 border border-black/70 autoFix'>{user.company}</td>
                          <td className='p-1 border border-black/70 autoFix'></td>
                          <td className='p-1 border border-black/70 autoFix'></td>
                        </tr>
                      )) || []}
                      {/* Boş satırlar ekleyerek 45 satıra tamamla */}
                      {Array.from({ 
                        length: Math.max(0, 40 - (groupMembers?.members?.length || 0)) 
                      }).map((_, index) => (
                        <tr key={`empty-main-${index}`} className={((groupMembers?.members?.length || 0) + index) % 2 === 0 ? "bg-white" : "bg-black/20"}>
                          <td className="p-1 border border-black/70 autoFix font-bold text-center">{(groupMembers?.members?.length || 0) + index + 1}</td>
                          <td className="p-1 border border-black/70 autoFix"></td>
                          <td className='p-1 border border-black/70 autoFix'></td>
                          <td className='p-1 border border-black/70 autoFix'></td>
                          <td className='p-1 border border-black/70 autoFix'></td>
                          <td className='p-1 border border-black/70 autoFix'></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                    {/* <table className="w-full border-collapse mt-4">
                        <thead>
                            <tr>
                                <th className="border border-black/70 p-2 text-xs autoFix text-[#C80F2E]">Sıra</th>
                                <th className="border border-black/70 p-2 text-xs autoFix text-[#C80F2E]">Ziyaretçi Adı Soyadı</th>
                                <th className="border border-black/70 p-2 text-xs autoFix text-[#C80F2E]">Ziyaretçi Kategori</th>
                                <th className="border border-black/70 p-2 text-xs autoFix text-[#C80F2E]">Ziyaretçi Firma</th>
                                <th className="border border-black/70 p-2 text-xs autoFix text-[#C80F2E]">Ziyaretçi GSM</th>
                                <th className="border border-black/70 p-2 text-xs autoFix text-[#C80F2E]">Ziyaretçi E-mail</th>
                                <th className="border border-black/70 p-2 text-xs autoFix text-[#C80F2E]">Davet Eden Üye</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visitors.length > 0 ? (
                                visitors.map((visitor, index) => (
                                    <tr key={visitor.id} className={index % 2 === 0 ? "bg-black/20" : "bg-white"}>
                                        <td className="border border-black/70 p-2 text-xs text-center autoFix">{index + 1}</td>
                                        <td className="border border-black/70 p-2 text-xs autoFix">{visitor.full_name}</td>
                                        <td className="border border-black/70 p-2 text-xs autoFix">{visitor.category}</td>
                                        <td className="border border-black/70 p-2 text-xs autoFix">{visitor.company}</td>
                                        <td className="border border-black/70 p-2 text-xs autoFix">{visitor.phone}</td>
                                        <td className="border border-black/70 p-2 text-xs autoFix">{visitor.email}</td>
                                        <td className="border border-black/70 p-2 text-xs autoFix">{visitor.invited_by_full_name}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="border border-gray-300 p-2 text-sm text-center" colSpan="7">
                                        {isLoading ? 'Ziyaretçiler yükleniyor...' : 'Henüz ziyaretçi kaydı bulunmamaktadır.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PagePrint3;