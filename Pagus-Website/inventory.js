// ============================================
//  PAGUS MENSWEAR - URUN VERITABANI
//  Guncelleme: Subat 2026
// ============================================
//
//  YENI URUN EKLEMEK ICIN:
//  1. images/{mainCat}/{urun-kodu}/ klasorunu olustur
//  2. Icine resimleri koy: {urun-kodu} (1).webp, {urun-kodu} (2).webp ...
//  3. Asagiya yeni satir ekle (virgulu unutma!)
//
//  ORNEK:
//  { mainCat: "Wedding Suits", subCat: "2026 Collection", code: "50200-01", realCode: "50200-01", folderPath: "Wedding Suits/50200-01" },
//
// ============================================

const productsDB = [

    // =============================================
    //  WEDDING SUITS
    // =============================================
    { mainCat: "Wedding Suits", subCat: "2026 Collection", code: "1023D170",    realCode: "1023D170",    folderPath: "Wedding Suits/1023D170" },
    { mainCat: "Wedding Suits", subCat: "2026 Collection", code: "50003-01",    realCode: "50003-01",    folderPath: "Wedding Suits/50003-01" },
    { mainCat: "Wedding Suits", subCat: "2026 Collection", code: "50005-01",    realCode: "50005-01",    folderPath: "Wedding Suits/50005-01" },
    { mainCat: "Wedding Suits", subCat: "2026 Collection", code: "50005-02",    realCode: "50005-02",    folderPath: "Wedding Suits/50005-02" },
    { mainCat: "Wedding Suits", subCat: "2026 Collection", code: "50055-6",     realCode: "50055-6",     folderPath: "Wedding Suits/50055-6" },
    { mainCat: "Wedding Suits", subCat: "2026 Collection", code: "50059-1",     realCode: "50059-1",     folderPath: "Wedding Suits/50059-1" },
    { mainCat: "Wedding Suits", subCat: "2026 Collection", code: "50111-02",    realCode: "50111-02",    folderPath: "Wedding Suits/50111-02" },
    { mainCat: "Wedding Suits", subCat: "2026 Collection", code: "50111-2 laci",realCode: "50111-2 Laci",folderPath: "Wedding Suits/50111-2 laci" },
    { mainCat: "Wedding Suits", subCat: "2026 Collection", code: "50111-3",     realCode: "50111-3",     folderPath: "Wedding Suits/50111-3" },
    { mainCat: "Wedding Suits", subCat: "2026 Collection", code: "50111-09",    realCode: "50111-09",    folderPath: "Wedding Suits/50111-09" },
    { mainCat: "Wedding Suits", subCat: "2026 Collection", code: "50111-9",     realCode: "50111-9",     folderPath: "Wedding Suits/50111-9" },
    { mainCat: "Wedding Suits", subCat: "2026 Collection", code: "50112-22",    realCode: "50112-22",    folderPath: "Wedding Suits/50112-22" },
    { mainCat: "Wedding Suits", subCat: "2026 Collection", code: "50113-6",     realCode: "50113-6",     folderPath: "Wedding Suits/50113-6" },

    // =============================================
    //  FORMAL SUITS
    // =============================================
    { mainCat: "Formal Suits", subCat: "2026 Collection", code: "1023D170-02",  realCode: "1023D170-02", folderPath: "Formal Suits/1023D170-02" },
    { mainCat: "Formal Suits", subCat: "2026 Collection", code: "15097-17",     realCode: "15097-17",    folderPath: "Formal Suits/15097-17" },
    { mainCat: "Formal Suits", subCat: "2026 Collection", code: "15104-03",     realCode: "15104-03",    folderPath: "Formal Suits/15104-03" },
    { mainCat: "Formal Suits", subCat: "2026 Collection", code: "15118-35",     realCode: "15118-35",    folderPath: "Formal Suits/15118-35" },
    { mainCat: "Formal Suits", subCat: "2026 Collection", code: "15120_43",     realCode: "15120-43",    folderPath: "Formal Suits/15120_43" },
    { mainCat: "Formal Suits", subCat: "2026 Collection", code: "15124_13",     realCode: "15124-13",    folderPath: "Formal Suits/15124_13" },
    { mainCat: "Formal Suits", subCat: "2026 Collection", code: "15124-01",     realCode: "15124-01",    folderPath: "Formal Suits/15124-01" },
    { mainCat: "Formal Suits", subCat: "2026 Collection", code: "15124-31",     realCode: "15124-31",    folderPath: "Formal Suits/15124-31" },
    { mainCat: "Formal Suits", subCat: "2026 Collection", code: "15127_17",     realCode: "15127-17",    folderPath: "Formal Suits/15127_17" },
    { mainCat: "Formal Suits", subCat: "2026 Collection", code: "15128-02",     realCode: "15128-02",    folderPath: "Formal Suits/15128-02" },
    { mainCat: "Formal Suits", subCat: "2026 Collection", code: "15130_03",     realCode: "15130-03",    folderPath: "Formal Suits/15130_03" },

    // =============================================
    //  SHIRTS  (klasorleri olusturunca ekle)
    // =============================================
    // { mainCat: "Shirts", subCat: "2026 Collection", code: "XXXX", realCode: "XXXX", folderPath: "Shirts/XXXX" },

    // =============================================
    //  SHOES  (klasorleri olusturunca ekle)
    // =============================================
    // { mainCat: "Shoes", subCat: "2026 Collection", code: "XXXX", realCode: "XXXX", folderPath: "Shoes/XXXX" },

    // =============================================
    //  ACCESSORIES  (klasorleri olusturunca ekle)
    // =============================================
    // { mainCat: "Accessories", subCat: "2026 Collection", code: "XXXX", realCode: "XXXX", folderPath: "Accessories/XXXX" },

    // =============================================
    //  CHILDREN  (klasorleri olusturunca ekle)
    // =============================================
    // { mainCat: "Children", subCat: "2026 Collection", code: "XXXX", realCode: "XXXX", folderPath: "Children/XXXX" },

];
