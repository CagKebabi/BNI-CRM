import React, { useState, useEffect } from 'react';
import { groupMembersService } from '../services/groupMembers.service';
import bniLogo from '../assets/bni-logo_brandlogos.net_vdxgj.png';
import uyeKartAlt from '../assets/uye_kart_alt.jpg';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Checkbox } from '../components/ui/checkbox';
import { Printer, Edit, RotateCcw, Save, Users, Plus } from 'lucide-react';
import './PagePrint.css';
import { useGroup } from '../contexts/GroupContext';

const PagePrint5 = () => {  
  const { selectedGroupContext } = useGroup();
  const [groupMembers, setGroupMembers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [addedMembers, setAddedMembers] = useState([]); // Eklenen üyeleri takip et
  const [pages, setPages] = useState([
    Array.from({ length: 9 }, (_, index) => ({
      id: index,
      name: 'İsim Soyisim',
      profession: 'Kategori',
      group: selectedGroupContext?.name || 'BNI Grubu',
      isEmpty: true
    }))
  ]);

  useEffect(() => {
    fetchGroupMembers();
    console.log("selectedGroupContext", selectedGroupContext);
    console.log("groupMembers", groupMembers);
  }, [selectedGroupContext]);

  const fetchGroupMembers = async () => {
    const groupMembers = await groupMembersService.getGroupMembers(selectedGroupContext?.id);
    setGroupMembers(groupMembers.members);
  }

  const handlePrint = () => {
    // Eğer sayfa döndürülmüşse, önce döndürmeyi kaldır
    const wasRotated = isRotated;
    if (wasRotated) {
      setIsRotated(false);
    }
    
    // PDF adını dinamik olarak ayarla
    const originalTitle = document.title;
    const currentDate = new Date().toLocaleDateString('tr-TR').replace(/\./g, '-');
    document.title = `BNI_${selectedGroupContext?.name || 'Grup'}_Uye_Kartı`;
    
    // Kısa bir gecikme ile yazdırma işlemini başlat (DOM güncellemesi için)
    setTimeout(() => {
      window.print();
      
      // Yazdırma işlemi tamamlandıktan sonra orijinal title'ı geri yükle
      setTimeout(() => {
        document.title = originalTitle;
        // Eğer sayfa önceden döndürülmüşse, yazdırma sonrası tekrar döndür
        if (wasRotated) {
          setIsRotated(true);
        }
      }, 1000);
    }, 100);
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  }

  const handleRotateToggle = () => {
    setIsRotated(!isRotated);
  }

  const handleCardUpdate = (pageIndex, cardIndex, field, value) => {
    setPages(prevPages => 
      prevPages.map((page, pIndex) => 
        pIndex === pageIndex
          ? page.map((card, cIndex) => 
              cIndex === cardIndex 
                ? { ...card, [field]: value }
                : card
            )
          : page
      )
    );
  }

  const handleSave = () => {
    setIsEditing(false);
    // Burada verileri backend'e kaydetme işlemi yapılabilir
    console.log('Kart verileri kaydedildi:', pages);
  }

  const handleMemberSelection = (memberId, isSelected) => {
    if (isSelected) {
      // Eğer üye zaten eklenmişse, sadece seçili listesine ekle
      if (!addedMembers.includes(memberId)) {
        setSelectedMembers(prev => [...prev, memberId]);
      }
    } else {
      // Eğer üye eklenmişse, hem seçili listesinden hem de eklenen listesinden çıkar
      setSelectedMembers(prev => prev.filter(id => id !== memberId));
      if (addedMembers.includes(memberId)) {
        removeMemberFromCards(memberId);
      }
    }
  }

  const handleSelectAllMembers = () => {
    const availableMembers = groupMembers.filter(member => !addedMembers.includes(member.id));
    if (selectedMembers.length === availableMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(availableMembers.map(member => member.id));
    }
  }

  const addMembersToCards = (members) => {
    const newPages = [...pages];
    const newAddedMembers = [...addedMembers];
    
    // Mevcut dolu kartları say
    let currentCardIndex = 0;
    let currentPageIndex = 0;
    
    // Mevcut dolu kartları bul
    for (let pageIdx = 0; pageIdx < newPages.length; pageIdx++) {
      for (let cardIdx = 0; cardIdx < newPages[pageIdx].length; cardIdx++) {
        if (!newPages[pageIdx][cardIdx].isEmpty) {
          currentCardIndex++;
        }
      }
    }
    
    members.forEach((member) => {
      // Zaten eklenmişse atla
      if (newAddedMembers.includes(member.id)) return;
      
      const pageIndex = Math.floor(currentCardIndex / 9);
      const cardIndex = currentCardIndex % 9;
      
      // Yeni sayfa gerekiyorsa oluştur
      while (newPages.length <= pageIndex) {
        newPages.push(Array.from({ length: 9 }, (_, index) => ({
          id: newPages.length * 9 + index,
          name: 'İsim Soyisim',
          profession: 'Kategori',
          group: selectedGroupContext?.name || 'BNI Grubu',
          isEmpty: true
        })));
      }
      
      // Üyeyi karta ekle
      newPages[pageIndex][cardIndex] = {
        id: newPages[pageIndex][cardIndex].id,
        name: `${member.first_name} ${member.last_name}`,
        profession: member.category || 'Kategori',
        group: selectedGroupContext?.name || 'BNI Grubu',
        isEmpty: false,
        memberId: member.id
      };
      
      newAddedMembers.push(member.id);
      currentCardIndex++;
    });
    
    setPages(newPages);
    setAddedMembers(newAddedMembers);
    setIsDialogOpen(false);
    setSelectedMembers([]);
  }

  const removeMemberFromCards = (memberId) => {
    const newPages = [...pages];
    const newAddedMembers = addedMembers.filter(id => id !== memberId);
    
    // Üyeyi kartlardan çıkar
    for (let pageIdx = 0; pageIdx < newPages.length; pageIdx++) {
      for (let cardIdx = 0; cardIdx < newPages[pageIdx].length; cardIdx++) {
        if (newPages[pageIdx][cardIdx].memberId === memberId) {
          newPages[pageIdx][cardIdx] = {
            id: newPages[pageIdx][cardIdx].id,
            name: 'İsim Soyisim',
            profession: 'Kategori',
            group: selectedGroupContext?.name || 'BNI Grubu',
            isEmpty: true
          };
          break;
        }
      }
    }
    
    // Boş sayfaları kaldır (ilk sayfa hariç)
    while (newPages.length > 1 && newPages[newPages.length - 1].every(card => card.isEmpty)) {
      newPages.pop();
    }
    
    setPages(newPages);
    setAddedMembers(newAddedMembers);
  }

  const handleAddAllMembers = () => {
    addMembersToCards(groupMembers);
  }

  const handleAddSelectedMembers = () => {
    const membersToAdd = groupMembers.filter(member => 
      selectedMembers.includes(member.id)
    );
    addMembersToCards(membersToAdd);
  }

  return (
    <>
      {/* Yazdırma, Düzenle ve Döndür butonları - sadece ekranda görünür */}
      <div className="print:hidden flex justify-center gap-3 autoFix mb-6">
        <Button
          onClick={handlePrint}
          variant="default"
          size="default"
          className="gap-2"
        >
          <Printer className="h-4 w-4" />
          Yazdır (A4)
        </Button>
        <Button
          onClick={handleRotateToggle}
          variant={isRotated ? "default" : "outline"}
          size="default"
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          {isRotated ? 'Döndürmeyi Kaldır' : 'Döndür'}
        </Button>
        
        {/* Grup Üyeleri Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="default"
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              Grup Üyeleri
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Grup Üyeleri - Kartvizit Seçimi</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Kartvizitlere eklemek istediğiniz üyeleri seçin (maksimum 9 üye)
                </p>
                <Button
                  onClick={handleSelectAllMembers}
                  variant="outline"
                  size="sm"
                >
                  {selectedMembers.length === groupMembers.length ? 'Tümünü Kaldır' : 'Tümünü Seç'}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {groupMembers.map((member) => {
                  const isAdded = addedMembers.includes(member.id);
                  const isSelected = selectedMembers.includes(member.id);
                  return (
                    <div key={member.id} className={`flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 ${isAdded ? 'bg-green-50 border-green-200' : ''}`}>
                      <Checkbox
                        checked={isAdded || isSelected}
                        onCheckedChange={(checked) => handleMemberSelection(member.id, checked)}
                        disabled={isAdded}
                      />
                      <div className="flex-1">
                        <div className="font-medium">
                          {member.first_name} {member.last_name}
                          {isAdded && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Eklendi</span>}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.category || 'Kategori belirtilmemiş'}
                        </div>
                        <div className="text-sm text-gray-400">
                          {member.email}
                        </div>
                        {member.roles && member.roles.length > 0 && (
                          <div className="text-xs text-blue-600 mt-1">
                            {member.roles.map(role => role.role).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  onClick={() => setIsDialogOpen(false)}
                  variant="outline"
                >
                  İptal
                </Button>
                <Button
                  onClick={handleAddAllMembers}
                  variant="secondary"
                  disabled={groupMembers.length === 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tüm Üyeleri Ekle
                </Button>
                <Button
                  onClick={handleAddSelectedMembers}
                  disabled={selectedMembers.length === 0}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Seçilenleri Ekle ({selectedMembers.length})
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {!isEditing ? (
          <Button
            onClick={handleEditToggle}
            variant="outline"
            size="default"
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Düzenle
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              variant="default"
              size="default"
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Kaydet
            </Button>
            {/* <Button
              onClick={() => setIsEditing(false)}
              variant="outline"
              size="default"
              className="gap-2"
            >
              <X className="h-4 w-4" />
              İptal
            </Button> */}
          </div>
        )}
      </div>

      {/* A4 Sayfalar Konteyner */}
      <div className="flex flex-col gap-0">
        {pages.map((pageCards, pageIndex) => (
          <div key={pageIndex} className="flex justify-center">
            <div className={`a4-page ${isRotated ? '-rotate-90' : ''}`}>
              <div className='a4-content autoFix'>
                {/* Sayfa içeriği */}
                <div className='pl-[20px] pr-[20px] autoFix h-full flex justify-center items-center'>
                  {/* 3x3 BNI Kartvizit Grid */}
                  <div className="flex flex-wrap p-2 gap-0.5 rotate-90 autoFix min-w-[290mm] min-h-[200mm] autoFix">
                    {pageCards.map((card, cardIndex) => (
                      <div key={card.id} className="relative bg-white border-1 border-black overflow-hidden w-[33%] autoFix">
                        {/* Üst bölüm - Beyaz alan */}
                        <div className="bg-white h-full p-3 flex flex-col justify-between relative autoFix">
                          {/* BNI Logo */}
                          <div className="flex">
                            <img 
                              src={bniLogo} 
                              alt="BNI Logo" 
                              className="h-6 w-auto"
                            />
                          </div>
                          <div className='flex-grow flex justify-center items-center relative z-10'>
                              <div className='flex flex-col items-center justify-center gap-3'>
                                  {isEditing ? (
                                    <>
                                      <input
                                        type="text"
                                        value={card.name}
                                        onChange={(e) => handleCardUpdate(pageIndex, cardIndex, 'name', e.target.value)}
                                        className='font-bold text-xl text-center bg-yellow-100 border border-yellow-300 rounded px-2 py-1 w-full'
                                        placeholder="İsim Soyisim"
                                      />
                                      <input
                                        type="text"
                                        value={card.profession}
                                        onChange={(e) => handleCardUpdate(pageIndex, cardIndex, 'profession', e.target.value)}
                                        className='font-bold text-md text-center bg-yellow-100 border border-yellow-300 rounded px-2 py-1 w-full'
                                        placeholder="Meslek"
                                      />
                                      <input
                                        type="text"
                                        value={card.group}
                                        onChange={(e) => handleCardUpdate(pageIndex, cardIndex, 'group', e.target.value)}
                                        className='font-bold text-xl text-[#C80F2E] text-center bg-yellow-100 border border-yellow-300 rounded px-2 py-1 w-full'
                                        placeholder="Grup Adı"
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <div className='font-bold text-xl'>{card.name}</div>
                                      <div className='font-bold text-md'>{card.profession}</div>
                                      <div className='font-bold text-xl text-[#C80F2E]'>{card.group}</div>
                                    </>
                                  )}
                              </div>
                          </div>
                        </div>
                        <img src={uyeKartAlt} alt="Uye Kart Alt" className='absolute bottom-0 right-0 w-[50%] h-auto object-cover' />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PagePrint5;