import React, { useRef } from 'react';
import bniLogo from '../assets/bni-logo_brandlogos.net_vdxgj.png';
import './PagePrint.css'; // CSS dosyasını import edeceğiz

const PagePrint = () => {  
  const printRef = useRef(null);

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

      {/* A4 Sayfa Konteyner */}
      <div className="flex justify-center">
        <div 
          ref={printRef}
          className="a4-page"
        >
          {/* Buraya içeriğinizi ekleyebilirsiniz */}
          <div className="a4-content">
            {/* İçerik buraya gelecek */}
            <div className='text-[12px] font-bold h-[63px] pl-[28px] pr-[28px] flex items-center justify-between bg-[#F3F3F3] autoFix'>
                <img className='w-[43px]' src={bniLogo} alt="" />
                <div className='w-[2px] h-[20px] bg-[#DFDFDF]'></div>
                <h2 className=' font-bold text-[#C80F2E]'>
                    PRUVA <br />
                    GRUP TOPLANTISI
                </h2>
                <div className='w-[2px] h-[20px] bg-[#DFDFDF]'></div>
                <div className='font-bold flex gap-3 items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                        <path d="M9.49976 19C4.26118 19 -0.000244141 14.7386 -0.000244141 9.5C-0.000244141 4.26143 4.26118 0 9.49976 0C14.7383 0 18.9998 4.26143 18.9998 9.5C18.9998 14.7386 14.7383 19 9.49976 19ZM9.49976 1.35714C5.00924 1.35714 1.3569 5.00949 1.3569 9.5C1.3569 13.9905 5.00924 17.6429 9.49976 17.6429C13.9903 17.6429 17.6426 13.9905 17.6426 9.5C17.6426 5.00949 13.9903 1.35714 9.49976 1.35714ZM13.3727 13.373C13.6382 13.1075 13.6382 12.6791 13.3727 12.4136L10.1783 9.21923V4.75C10.1783 4.37508 9.87467 4.07143 9.49976 4.07143C9.12484 4.07143 8.82118 4.37508 8.82118 4.75V9.5C8.82118 9.67982 8.89243 9.85286 9.01967 9.98008L12.4125 13.3729C12.5448 13.5053 12.7187 13.5714 12.8926 13.5714C13.0665 13.5714 13.2404 13.5053 13.3727 13.373Z" fill="black"/>
                    </svg>
                    <div>
                        <h2 className='text-black'>
                        HER PERŞEMBE
                    </h2>
                    <h2 className='text-[#C80F2E]'>
                        07:00 | 09:00 ARASI
                    </h2>
                    </div>
                </div>
                <div className='w-[2px] h-[20px] bg-[#DFDFDF]'></div>
                <div className='flex gap-1 items-center'>
                    <span className='text-[#C80F2E]'>
                        24 Nisan 2025
                    </span>
                    <span className='text-black'>
                        PERŞEMBE
                    </span>
                </div>
            </div>
            <div className='pl-[28px] pr-[28px] autoFix'>
                <div className='mt-[10px] flex gap-[30px] autoFix'>
                    <div className='text-[15px] font-bold text-[#C80F2E]'>
                        Lider <br />
                        Ekip
                    </div>
                    <div>
                        <ul className='text-[12px] grid grid-cols-4 gap-x-[30px] gap-y-[10px]'>
                            <li>
                                <div>Grup Başkanı</div>
                                <div className='font-bold'>
                                    Muhammet Emin Tezcan
                                </div>
                            </li>
                            <li>
                                <div>Üyelik komitesi başkanı</div>
                                <div className='font-bold'>
                                    Cemile Yaşar
                                </div>
                            </li>
                            <li>
                                <div>Sayman</div>
                                <div className='font-bold'>
                                    Ozan Albal
                                </div>
                            </li>
                            <li>
                                <div>Eğitim Koordinatörü</div>
                                <div className='font-bold'>
                                    Yusuf Ziya Nisanoğlu
                                </div>
                            </li>
                            <li>
                                <div>Etkinlik Koordinatörü</div>
                                <div className='font-bold'>
                                    Alper Özkalkan
                                </div>
                            </li>
                            <li>
                                <div>Ziyaretçi Komitesi Başkanı</div>
                                <div className='font-bold'>
                                    Kerim Kuru 
                                </div>
                            </li>
                            <li>
                                <div>Birebir Koordinatörü</div>
                                <div className='font-bold'>
                                    Serhat Küçükuygun
                                </div>
                            </li>
                            <li>
                                <div>Mentör Koordinatörü</div>
                                <div className='font-bold'>
                                    Selay Göytaş
                                </div>
                            </li>
                            <li>
                                <div>Güç Takımları Koordinatörü</div>
                                <div className='font-bold'>
                                    Muhammet Yağız
                                </div>
                            </li>
                            <li>
                                <div>Oryantasyon Sorumlusu</div>
                                <div className='font-bold'>
                                    Yusuf Ziya Nisanoğlu
                                </div>
                            </li>
                            <li>
                                <div>Sosyal Medya Sorumlusu</div>
                                <div className='font-bold'>
                                    Cansu Dumlu
                                </div>
                            </li>
                            <li>
                                <div>Teknik Sorumlu</div>
                                <div className='font-bold'>
                                    Muhammet Yağız
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='h-[2px] w-full bg-[#F3F3F3] mt-[15px] mb-[15px] autoFix'></div>
                <div className='flex items-center gap-[18px]'>
                    <div className='text-[15px] text-[#C80F2E] font-bold'>Üyelik Komitesi</div>
                    <ul className='flex text-[12px] font-bold gap-[12px] flex-wrap'>
                        <li>Ozan Albal</li>
                        <li>Muhammet Yağız</li>
                        <li>Selay Göytaş</li>
                        <li>Yusuf Ziya Nisanoğlu</li>
                        <li>Kadir Arslan</li>
                    </ul>
                </div>
                <div className='h-[2px] w-full bg-[#F3F3F3] mt-[15px] mb-[15px] autoFix'></div>
                <div className='flex items-center gap-[18px]'>
                    <div className='text-[15px] text-[#C80F2E] font-bold'>Ziyaretçi Komitesi</div>
                    <ul className='flex text-[12px] font-bold gap-[12px] flex-wrap'>
                        <li>Kadir Arslan</li>
                        <li>Mustafa Dağtekin</li>
                        <li>Muhammet Emin Tezcan</li>
                    </ul>
                </div>
                <div className='h-[2px] w-full bg-[#F3F3F3] mt-[15px] mb-[15px] autoFix'></div>
                <div className='flex items-center gap-[18px]'>
                    <div className='text-[15px] text-[#C80F2E] font-bold'>Sunum<br />Rotasyonu</div>
                    <ul className='flex items-center text-[12px] font-bold gap-[12px] flex-wrap'>
                        <div className='w-[2px] h-[30px] bg-[#DFDFDF]'></div>
                        <li>
                            <div className='text-[#C80F2E]'>24.04.2025</div>
                            <div>Stacan Korkmaz</div>
                        </li>
                        <div className='w-[2px] h-[30px] bg-[#DFDFDF]'></div>
                        <li>
                            <div className='text-[#C80F2E]'>24.04.2025</div>
                            <div>Stacan Korkmaz</div>
                        </li>
                        <div className='w-[2px] h-[30px] bg-[#DFDFDF]'></div>
                        <li>
                            <div className='text-[#C80F2E]'>24.04.2025</div>
                            <div>Stacan Korkmaz</div>
                        </li>
                        <div className='w-[2px] h-[30px] bg-[#DFDFDF]'></div>
                        <li>
                            <div className='text-[#C80F2E]'>24.04.2025</div>
                            <div>Stacan Korkmaz</div>
                        </li>
                        <div className='w-[2px] h-[30px] bg-[#DFDFDF]'></div>
                        <li>
                            <div className='text-[#C80F2E]'>24.04.2025</div>
                            <div>Stacan Korkmaz</div>
                        </li>
                    </ul>
                </div>
                <div className='h-[2px] w-full bg-[#F3F3F3] mt-[15px] mb-[15px] autoFix'></div>
                <div className='flex items-center gap-[18px]'>
                    <div className='text-[15px] text-[#C80F2E] font-bold'>Açık<br />Kategoriler</div>
                    <ul className='flex items-center text-[12px] font-bold gap-[12px] flex-wrap'>
                        <li className='w-[2px] h-[15px] bg-[#DFDFDF]'></li>
                        <li>
                            <div>Akupuntur</div>
                        </li>
                        <li className='w-[2px] h-[15px] bg-[#DFDFDF]'></li>
                        <li>
                            <div>Masör</div>
                        </li>
                        <li className='w-[2px] h-[15px] bg-[#DFDFDF]'></li>
                        <li>
                            <div>Çieki</div>
                        </li>
                        <li className='w-[2px] h-[15px] bg-[#DFDFDF]'></li>
                        <li>
                            <div>Çikolata İmalatı</div>
                        </li>
                        <li className='w-[2px] h-[15px] bg-[#DFDFDF]'></li>
                        <li>
                            <div>Promosyon Ürünleri</div>
                        </li>
                        <li className='w-[2px] h-[15px] bg-[#DFDFDF]'></li>
                        <li>
                            <div>Astrolog</div>
                        </li>
                        <li className='w-[2px] h-[15px] bg-[#DFDFDF]'></li>
                        <li>
                            <div>Petshop</div>
                        </li>
                        <li className='w-[2px] h-[15px] bg-[#DFDFDF]'></li>
                        <li>
                            <div>Akvaryum/Balıklar</div>
                        </li>
                        <li className='w-[2px] h-[15px] bg-[#DFDFDF]'></li>
                        <li>
                            <div>Eczacı</div>
                        </li>
                        <li className='w-[2px] h-[15px] bg-[#DFDFDF]'></li>
                        <li>
                            <div>Masj Terapisti</div>
                        </li>
                    </ul>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PagePrint;