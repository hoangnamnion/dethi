/**
 * Dữ liệu 23 Câu hỏi Tự luận Môn Kiến Trúc Cảnh Quan (KTCQ)
 * Trích xuất từ tài liệu filethi/KTCQ.docx
 *
 * Chuẩn hóa theo giao diện TypeScript / JavaScript Interface Contract trong PROJECT.md:
 * - window.TULUAN_DATA: Array<TuluanQuestion>
 * - Tương thích ngược: .questions, .chapters, .examId, .examName, .totalQuestions
 */

(function () {
    'use strict';

    const TULUAN_DATA = [
    {
        "id": 1,
        "chapterId": 1,
        "chapterTitle": "Chương 1. Khái niệm cơ bản về cảnh quan và kiến trúc cảnh quan",
        "questionNumber": 1,
        "title": "Khái niệm cảnh quan, yếu tố cấu thành và vai trò",
        "coreConcept": "Cảnh quan là toàn bộ những gì nhìn thấy được của một khu vực, gồm các yếu tố tự nhiên, vật lý (nhân tạo) và con người tương tác tạo thành tổng thể không gian đặc trưng.",
        "keywords": [
            "cảnh quan",
            "yếu tố tự nhiên",
            "yếu tố vật lý – nhân tạo",
            "yếu tố con người – văn hóa – xã hội",
            "tổng thể không gian",
            "cân bằng sinh thái",
            "bản sắc"
        ],
        "outline": [
            {
                "id": "p1",
                "order": 1,
                "heading": "Khái niệm cảnh quan",
                "details": [
                    "Cảnh quan là toàn bộ những gì có thể nhìn thấy của một khu vực, bao gồm các yếu tố tự nhiên, vật lý (nhân tạo) và con người, cùng tồn tại và tác động qua lại để tạo thành một tổng thể không gian có đặc trưng riêng."
                ],
                "keywords": [
                    "toàn bộ những gì có thể nhìn thấy",
                    "tổng thể không gian",
                    "tác động qua lại"
                ],
                "content": "Cảnh quan là toàn bộ những gì có thể nhìn thấy của một khu vực, bao gồm các yếu tố tự nhiên, vật lý (nhân tạo) và con người, cùng tồn tại và tác động qua lại để tạo thành một tổng thể không gian có đặc trưng riêng."
            },
            {
                "id": "p2",
                "order": 2,
                "heading": "Yếu tố tự nhiên (Nền tảng sinh thái)",
                "details": [
                    "Gồm địa hình, khí hậu, thủy văn, thảm thực vật, đất, động vật: là nền tảng của mọi cảnh quan.",
                    "Địa hình quyết định hình dạng và bố cục không gian.",
                    "Khí hậu và thủy văn chi phối sinh thái, vi khí hậu, nguồn nước.",
                    "Thảm thực vật tạo bóng mát, điều hòa không khí, hỗ trợ đa dạng sinh học và tạo vẻ đẹp theo mùa."
                ],
                "keywords": [
                    "địa hình",
                    "khí hậu",
                    "thủy văn",
                    "thảm thực vật",
                    "đa dạng sinh học"
                ],
                "content": "Gồm địa hình, khí hậu, thủy văn, thảm thực vật, đất, động vật: là nền tảng của mọi cảnh quan.\nĐịa hình quyết định hình dạng và bố cục không gian.\nKhí hậu và thủy văn chi phối sinh thái, vi khí hậu, nguồn nước.\nThảm thực vật tạo bóng mát, điều hòa không khí, hỗ trợ đa dạng sinh học và tạo vẻ đẹp theo mùa."
            },
            {
                "id": "p3",
                "order": 3,
                "heading": "Yếu tố vật lý – nhân tạo (Hình thái & Công năng)",
                "details": [
                    "Gồm công trình kiến trúc, hạ tầng giao thông, hạ tầng kỹ thuật, khu dân cư, công trình công cộng, tiểu cảnh.",
                    "Đáp ứng nhu cầu ở, đi lại, sản xuất, sinh hoạt; tạo nên hình khối, cấu trúc và công năng của không gian."
                ],
                "keywords": [
                    "công trình kiến trúc",
                    "hạ tầng giao thông",
                    "hạ tầng kỹ thuật",
                    "công năng",
                    "hình khối cấu trúc"
                ],
                "content": "Gồm công trình kiến trúc, hạ tầng giao thông, hạ tầng kỹ thuật, khu dân cư, công trình công cộng, tiểu cảnh.\nĐáp ứng nhu cầu ở, đi lại, sản xuất, sinh hoạt; tạo nên hình khối, cấu trúc và công năng của không gian."
            },
            {
                "id": "p4",
                "order": 4,
                "heading": "Yếu tố con người – văn hóa – xã hội (Linh hồn & Bản sắc)",
                "details": [
                    "Gồm phong tục, tập quán, lối sống, di sản, hoạt động cộng đồng: làm cho cảnh quan có hồn, có bản sắc và ý nghĩa.",
                    "Con người vừa là chủ thể sử dụng, vừa là tác nhân làm thay đổi cảnh quan."
                ],
                "keywords": [
                    "phong tục tập quán",
                    "lối sống",
                    "di sản",
                    "bản sắc",
                    "hoạt động cộng đồng"
                ],
                "content": "Gồm phong tục, tập quán, lối sống, di sản, hoạt động cộng đồng: làm cho cảnh quan có hồn, có bản sắc và ý nghĩa.\nCon người vừa là chủ thể sử dụng, vừa là tác nhân làm thay đổi cảnh quan."
            },
            {
                "id": "p5",
                "order": 5,
                "heading": "Mối quan hệ tương hỗ giữa ba nhóm yếu tố",
                "details": [
                    "Ba nhóm yếu tố gắn bó chặt chẽ: thiếu yếu tố tự nhiên thì mất cân bằng sinh thái; thiếu yếu tố nhân tạo thì không đáp ứng được nhu cầu sử dụng; thiếu yếu tố văn hóa – xã hội thì mất bản sắc."
                ],
                "keywords": [
                    "gắn bó chặt chẽ",
                    "mất cân bằng sinh thái",
                    "nhu cầu sử dụng",
                    "mất bản sắc"
                ],
                "content": "Ba nhóm yếu tố gắn bó chặt chẽ: thiếu yếu tố tự nhiên thì mất cân bằng sinh thái; thiếu yếu tố nhân tạo thì không đáp ứng được nhu cầu sử dụng; thiếu yếu tố văn hóa – xã hội thì mất bản sắc."
            }
        ],
        "globalIndex": 1,
        "chapterIndex": 1,
        "coreSummary": "Cảnh quan là toàn bộ những gì nhìn thấy được của một khu vực, gồm các yếu tố tự nhiên, vật lý (nhân tạo) và con người tương tác tạo thành tổng thể không gian đặc trưng."
    },
    {
        "id": 2,
        "chapterId": 1,
        "chapterTitle": "Chương 1. Khái niệm cơ bản về cảnh quan và kiến trúc cảnh quan",
        "questionNumber": 2,
        "title": "Khái niệm cảnh quan và vai trò trong đời sống, phát triển xã hội",
        "coreConcept": "Cảnh quan là toàn bộ những gì nhìn thấy được của một khu vực, giữ 6 vai trò trọng yếu: môi trường – sinh thái, sức khỏe – tinh thần, kinh tế, văn hóa – xã hội, thẩm mỹ và phát triển bền vững.",
        "keywords": [
            "môi trường – sinh thái",
            "sức khỏe – tinh thần",
            "kinh tế",
            "văn hóa – xã hội",
            "thẩm mỹ",
            "phát triển bền vững",
            "đa dạng sinh học"
        ],
        "outline": [
            {
                "id": "p1",
                "order": 1,
                "heading": "Khái niệm cảnh quan",
                "details": [
                    "Cảnh quan là toàn bộ những gì nhìn thấy được của một khu vực, hình thành từ các yếu tố tự nhiên, vật lý và con người."
                ],
                "keywords": [
                    "toàn bộ những gì nhìn thấy được",
                    "yếu tố tự nhiên",
                    "vật lý",
                    "con người"
                ],
                "content": "Cảnh quan là toàn bộ những gì nhìn thấy được của một khu vực, hình thành từ các yếu tố tự nhiên, vật lý và con người."
            },
            {
                "id": "p2",
                "order": 2,
                "heading": "Vai trò Môi trường – sinh thái",
                "details": [
                    "Điều hòa khí hậu, giảm ô nhiễm, giữ nước, duy trì cân bằng sinh thái và bảo tồn đa dạng sinh học."
                ],
                "keywords": [
                    "điều hòa khí hậu",
                    "giảm ô nhiễm",
                    "giữ nước",
                    "cân bằng sinh thái",
                    "đa dạng sinh học"
                ],
                "content": "Điều hòa khí hậu, giảm ô nhiễm, giữ nước, duy trì cân bằng sinh thái và bảo tồn đa dạng sinh học."
            },
            {
                "id": "p3",
                "order": 3,
                "heading": "Vai trò Sức khỏe – tinh thần",
                "details": [
                    "Cung cấp không gian nghỉ ngơi, vận động, giải trí; giảm căng thẳng, nâng cao chất lượng sống."
                ],
                "keywords": [
                    "nghỉ ngơi",
                    "vận động",
                    "giải trí",
                    "giảm căng thẳng",
                    "chất lượng sống"
                ],
                "content": "Cung cấp không gian nghỉ ngơi, vận động, giải trí; giảm căng thẳng, nâng cao chất lượng sống."
            },
            {
                "id": "p4",
                "order": 4,
                "heading": "Vai trò Kinh tế",
                "details": [
                    "Hỗ trợ sản xuất nông nghiệp, phát triển du lịch và dịch vụ, tăng giá trị đất đai và sức hấp dẫn của khu vực."
                ],
                "keywords": [
                    "sản xuất nông nghiệp",
                    "du lịch và dịch vụ",
                    "tăng giá trị đất đai"
                ],
                "content": "Hỗ trợ sản xuất nông nghiệp, phát triển du lịch và dịch vụ, tăng giá trị đất đai và sức hấp dẫn của khu vực."
            },
            {
                "id": "p5",
                "order": 5,
                "heading": "Vai trò Văn hóa – xã hội",
                "details": [
                    "Lưu giữ di sản, phản ánh lịch sử và lối sống; tạo bản sắc cho vùng và thành phố; là nơi giao lưu, gắn kết cộng đồng."
                ],
                "keywords": [
                    "lưu giữ di sản",
                    "phản ánh lịch sử",
                    "tạo bản sắc",
                    "gắn kết cộng đồng"
                ],
                "content": "Lưu giữ di sản, phản ánh lịch sử và lối sống; tạo bản sắc cho vùng và thành phố; là nơi giao lưu, gắn kết cộng đồng."
            },
            {
                "id": "p6",
                "order": 6,
                "heading": "Vai trò Thẩm mỹ",
                "details": [
                    "Tạo vẻ đẹp, cảm xúc và ấn tượng cho không gian sống."
                ],
                "keywords": [
                    "vẻ đẹp",
                    "cảm xúc",
                    "ấn tượng",
                    "không gian sống"
                ],
                "content": "Tạo vẻ đẹp, cảm xúc và ấn tượng cho không gian sống."
            },
            {
                "id": "p7",
                "order": 7,
                "heading": "Vai trò Phát triển bền vững",
                "details": [
                    "Là cơ sở để cân bằng kinh tế – xã hội – môi trường trong quy hoạch và định hướng phát triển."
                ],
                "keywords": [
                    "phát triển bền vững",
                    "cân bằng kinh tế – xã hội – môi trường",
                    "quy hoạch"
                ],
                "content": "Là cơ sở để cân bằng kinh tế – xã hội – môi trường trong quy hoạch và định hướng phát triển."
            }
        ],
        "globalIndex": 2,
        "chapterIndex": 2,
        "coreSummary": "Cảnh quan là toàn bộ những gì nhìn thấy được của một khu vực, giữ 6 vai trò trọng yếu: môi trường – sinh thái, sức khỏe – tinh thần, kinh tế, văn hóa – xã hội, thẩm mỹ và phát triển bền vững."
    },
    {
        "id": 3,
        "chapterId": 1,
        "chapterTitle": "Chương 1. Khái niệm cơ bản về cảnh quan và kiến trúc cảnh quan",
        "questionNumber": 3,
        "title": "Phân biệt cảnh quan tự nhiên và cảnh quan nhân tạo",
        "coreConcept": "Cảnh quan tự nhiên hình thành do quá trình tự nhiên biến đổi chậm theo quy luật sinh thái, trong khi cảnh quan nhân tạo do con người quy hoạch, xây dựng phục vụ nhu cầu sống.",
        "keywords": [
            "cảnh quan tự nhiên",
            "cảnh quan nhân tạo",
            "nguồn gốc",
            "thành phần chủ yếu",
            "mục đích",
            "tính chất",
            "cảnh quan hỗn hợp",
            "ruộng bậc thang"
        ],
        "table": {
            "headers": [
                "Tiêu chí",
                "Cảnh quan tự nhiên",
                "Cảnh quan nhân tạo"
            ],
            "rows": [
                [
                    "Nguồn gốc",
                    "Hình thành do quá trình tự nhiên, ít hoặc không có tác động của con người",
                    "Do con người quy hoạch, thiết kế, xây dựng hoặc cải tạo"
                ],
                [
                    "Thành phần chủ yếu",
                    "Địa hình, khí hậu, thủy văn, thảm thực vật, động vật",
                    "Công trình, hạ tầng, công viên, vườn, khu dân cư, khu sản xuất"
                ],
                [
                    "Mục đích",
                    "Tồn tại theo quy luật sinh thái; bảo tồn, nghiên cứu, tham quan",
                    "Phục vụ nhu cầu ở, sản xuất, nghỉ ngơi, giao lưu, thẩm mỹ"
                ],
                [
                    "Tính chất",
                    "Biến đổi chậm theo quy luật tự nhiên, cần được bảo tồn",
                    "Có tổ chức, có kế hoạch, cần quản lý và duy tu"
                ],
                [
                    "Ví dụ",
                    "Vịnh Hạ Long, hồ Ba Bể, vườn quốc gia Cúc Phương",
                    "Công viên Thống Nhất, vườn Versailles, khu đô thị, khu công nghiệp"
                ]
            ],
            "note": "Lưu ý: nhiều cảnh quan mang tính hỗn hợp, ví dụ ruộng bậc thang vừa dựa trên địa hình tự nhiên vừa do con người tạo dựng."
        },
        "outline": [
            {
                "id": "p1",
                "order": 1,
                "heading": "Bảng đối chiếu 5 tiêu chí phân biệt",
                "details": [
                    "Phân biệt cảnh quan tự nhiên và cảnh quan nhân tạo qua 5 tiêu chí: Nguồn gốc, Thành phần chủ yếu, Mục đích, Tính chất và Ví dụ thực tế."
                ],
                "keywords": [
                    "nguồn gốc",
                    "thành phần chủ yếu",
                    "mục đích",
                    "tính chất",
                    "ví dụ"
                ],
                "content": "Phân biệt cảnh quan tự nhiên và cảnh quan nhân tạo qua 5 tiêu chí: Nguồn gốc, Thành phần chủ yếu, Mục đích, Tính chất và Ví dụ thực tế."
            },
            {
                "id": "p2",
                "order": 2,
                "heading": "Cảnh quan hỗn hợp và tính giao thoa",
                "details": [
                    "Lưu ý: nhiều cảnh quan mang tính hỗn hợp, ví dụ ruộng bậc thang vừa dựa trên địa hình tự nhiên vừa do con người tạo dựng."
                ],
                "keywords": [
                    "cảnh quan hỗn hợp",
                    "ruộng bậc thang",
                    "địa hình tự nhiên",
                    "con người tạo dựng"
                ],
                "content": "Lưu ý: nhiều cảnh quan mang tính hỗn hợp, ví dụ ruộng bậc thang vừa dựa trên địa hình tự nhiên vừa do con người tạo dựng."
            }
        ],
        "globalIndex": 3,
        "chapterIndex": 3,
        "coreSummary": "Cảnh quan tự nhiên hình thành do quá trình tự nhiên biến đổi chậm theo quy luật sinh thái, trong khi cảnh quan nhân tạo do con người quy hoạch, xây dựng phục vụ nhu cầu sống."
    },
    {
        "id": 4,
        "chapterId": 1,
        "chapterTitle": "Chương 1. Khái niệm cơ bản về cảnh quan và kiến trúc cảnh quan",
        "questionNumber": 4,
        "title": "Cảnh quan vùng và các loại chủ yếu",
        "coreConcept": "Cảnh quan vùng là cảnh quan quy mô lãnh thổ lớn gắn kết tự nhiên và nhân tạo, gồm 4 loại chính: thiên nhiên, sản xuất, điểm dân cư và du lịch – nghỉ dưỡng.",
        "keywords": [
            "cảnh quan vùng",
            "quy mô lãnh thổ lớn",
            "cảnh quan thiên nhiên",
            "cảnh quan sản xuất",
            "cảnh quan điểm dân cư",
            "cảnh quan du lịch – nghỉ dưỡng",
            "cân bằng sinh thái"
        ],
        "outline": [
            {
                "id": "p1",
                "order": 1,
                "heading": "Khái niệm cảnh quan vùng",
                "details": [
                    "Cảnh quan vùng là cảnh quan ở quy mô lãnh thổ lớn (một vùng, miền hoặc liên tỉnh), là tổ hợp gắn kết giữa các yếu tố tự nhiên và nhân tạo trong cùng một phạm vi không gian; được xem là bộ phận quan trọng của cảnh quan nhân tạo."
                ],
                "keywords": [
                    "quy mô lãnh thổ lớn",
                    "tổ hợp gắn kết",
                    "tự nhiên và nhân tạo",
                    "cảnh quan nhân tạo"
                ],
                "content": "Cảnh quan vùng là cảnh quan ở quy mô lãnh thổ lớn (một vùng, miền hoặc liên tỉnh), là tổ hợp gắn kết giữa các yếu tố tự nhiên và nhân tạo trong cùng một phạm vi không gian; được xem là bộ phận quan trọng của cảnh quan nhân tạo."
            },
            {
                "id": "p2",
                "order": 2,
                "heading": "Yếu tố cấu thành",
                "details": [
                    "Nhóm tự nhiên gồm địa hình, khí hậu, thủy văn, thảm thực vật.",
                    "Nhóm nhân tạo gồm hạ tầng giao thông, khu dân cư, công trình công cộng."
                ],
                "keywords": [
                    "nhóm tự nhiên",
                    "nhóm nhân tạo",
                    "hạ tầng giao thông",
                    "khu dân cư"
                ],
                "content": "Nhóm tự nhiên gồm địa hình, khí hậu, thủy văn, thảm thực vật.\nNhóm nhân tạo gồm hạ tầng giao thông, khu dân cư, công trình công cộng."
            },
            {
                "id": "p3",
                "order": 3,
                "heading": "4 loại cảnh quan vùng chủ yếu",
                "details": [
                    "Cảnh quan thiên nhiên: gồm cảnh quan bảo tồn (vườn quốc gia, khu dự trữ thiên nhiên) và cảnh quan có giá trị nghệ thuật độc đáo (hồ Ba Bể, vịnh Hạ Long).",
                    "Cảnh quan sản xuất: vùng trồng trọt, lâm nghiệp, thủy sản và vùng công nghiệp.",
                    "Cảnh quan điểm dân cư: đô thị và nông thôn.",
                    "Cảnh quan du lịch – nghỉ dưỡng: các khu du lịch sinh thái, nghỉ dưỡng, văn hóa."
                ],
                "keywords": [
                    "cảnh quan thiên nhiên",
                    "cảnh quan sản xuất",
                    "cảnh quan điểm dân cư",
                    "cảnh quan du lịch – nghỉ dưỡng"
                ],
                "content": "Cảnh quan thiên nhiên: gồm cảnh quan bảo tồn (vườn quốc gia, khu dự trữ thiên nhiên) và cảnh quan có giá trị nghệ thuật độc đáo (hồ Ba Bể, vịnh Hạ Long).\nCảnh quan sản xuất: vùng trồng trọt, lâm nghiệp, thủy sản và vùng công nghiệp.\nCảnh quan điểm dân cư: đô thị và nông thôn.\nCảnh quan du lịch – nghỉ dưỡng: các khu du lịch sinh thái, nghỉ dưỡng, văn hóa."
            },
            {
                "id": "p4",
                "order": 4,
                "heading": "Vai trò của cảnh quan vùng",
                "details": [
                    "Duy trì cân bằng sinh thái, bảo tồn đa dạng sinh học, định hướng sử dụng đất và phát triển kinh tế – xã hội bền vững của vùng."
                ],
                "keywords": [
                    "cân bằng sinh thái",
                    "đa dạng sinh học",
                    "định hướng sử dụng đất",
                    "phát triển bền vững"
                ],
                "content": "Duy trì cân bằng sinh thái, bảo tồn đa dạng sinh học, định hướng sử dụng đất và phát triển kinh tế – xã hội bền vững của vùng."
            }
        ],
        "globalIndex": 4,
        "chapterIndex": 4,
        "coreSummary": "Cảnh quan vùng là cảnh quan quy mô lãnh thổ lớn gắn kết tự nhiên và nhân tạo, gồm 4 loại chính: thiên nhiên, sản xuất, điểm dân cư và du lịch – nghỉ dưỡng."
    },
    {
        "id": 5,
        "chapterId": 1,
        "chapterTitle": "Chương 1. Khái niệm cơ bản về cảnh quan và kiến trúc cảnh quan",
        "questionNumber": 5,
        "title": "Cảnh quan đô thị: yếu tố vật lý và phi vật lý",
        "coreConcept": "Cảnh quan đô thị là toàn bộ không gian vật chất và phi vật chất của đô thị, bao gồm các yếu tố vật lý hữu hình và phi vật lý vô hình bổ sung cho nhau tạo bản sắc và chất lượng sống.",
        "keywords": [
            "cảnh quan đô thị",
            "yếu tố vật lý hữu hình",
            "yếu tố phi vật lý vô hình",
            "không gian công cộng",
            "văn hóa lịch sử",
            "cảm nhận giác quan",
            "thể chế quản lý"
        ],
        "outline": [
            {
                "id": "p1",
                "order": 1,
                "heading": "Khái niệm cảnh quan đô thị",
                "details": [
                    "Cảnh quan đô thị là toàn bộ không gian vật chất và phi vật chất của đô thị mà con người nhìn thấy và cảm nhận được, bao gồm các thành phần tự nhiên, nhân tạo, văn hóa và xã hội."
                ],
                "keywords": [
                    "toàn bộ không gian",
                    "vật chất và phi vật chất",
                    "nhìn thấy và cảm nhận"
                ],
                "content": "Cảnh quan đô thị là toàn bộ không gian vật chất và phi vật chất của đô thị mà con người nhìn thấy và cảm nhận được, bao gồm các thành phần tự nhiên, nhân tạo, văn hóa và xã hội."
            },
            {
                "id": "p2",
                "order": 2,
                "heading": "Yếu tố vật lý (hữu hình)",
                "details": [
                    "Tự nhiên: địa hình, sông hồ, mặt nước, cây xanh, không gian xanh.",
                    "Nhân tạo: công trình kiến trúc, đường phố, cầu, hạ tầng kỹ thuật.",
                    "Không gian công cộng: quảng trường, công viên, vườn hoa, tuyến phố đi bộ; cùng các tiểu cảnh, chiếu sáng, biển hiệu, tiện ích đô thị."
                ],
                "keywords": [
                    "tự nhiên",
                    "nhân tạo",
                    "không gian công cộng",
                    "quảng trường",
                    "công viên",
                    "tiểu cảnh"
                ],
                "content": "Tự nhiên: địa hình, sông hồ, mặt nước, cây xanh, không gian xanh.\nNhân tạo: công trình kiến trúc, đường phố, cầu, hạ tầng kỹ thuật.\nKhông gian công cộng: quảng trường, công viên, vườn hoa, tuyến phố đi bộ; cùng các tiểu cảnh, chiếu sáng, biển hiệu, tiện ích đô thị."
            },
            {
                "id": "p3",
                "order": 3,
                "heading": "Yếu tố phi vật lý (vô hình)",
                "details": [
                    "Văn hóa – lịch sử: di tích, truyền thống, bản sắc, ký ức đô thị, lễ hội.",
                    "Xã hội: lối sống, hoạt động giao lưu, tương tác của cộng đồng.",
                    "Cảm nhận giác quan và trải nghiệm: ánh sáng, âm thanh, mùi hương, không khí, cảm giác an toàn, thoải mái.",
                    "Thể chế: quy hoạch, chính sách, quản lý và sự tham gia của cộng đồng."
                ],
                "keywords": [
                    "văn hóa lịch sử",
                    "xã hội",
                    "cảm nhận giác quan",
                    "trải nghiệm",
                    "thể chế quản lý"
                ],
                "content": "Văn hóa – lịch sử: di tích, truyền thống, bản sắc, ký ức đô thị, lễ hội.\nXã hội: lối sống, hoạt động giao lưu, tương tác của cộng đồng.\nCảm nhận giác quan và trải nghiệm: ánh sáng, âm thanh, mùi hương, không khí, cảm giác an toàn, thoải mái.\nThể chế: quy hoạch, chính sách, quản lý và sự tham gia của cộng đồng."
            },
            {
                "id": "p4",
                "order": 4,
                "heading": "Mối quan hệ bổ trợ",
                "details": [
                    "Hai nhóm yếu tố bổ sung cho nhau để tạo nên bản sắc và chất lượng sống của thành phố."
                ],
                "keywords": [
                    "bổ sung cho nhau",
                    "tạo nên bản sắc",
                    "chất lượng sống"
                ],
                "content": "Hai nhóm yếu tố bổ sung cho nhau để tạo nên bản sắc và chất lượng sống của thành phố."
            }
        ],
        "globalIndex": 5,
        "chapterIndex": 5,
        "coreSummary": "Cảnh quan đô thị là toàn bộ không gian vật chất và phi vật chất của đô thị, bao gồm các yếu tố vật lý hữu hình và phi vật lý vô hình bổ sung cho nhau tạo bản sắc và chất lượng sống."
    },
    {
        "id": 6,
        "chapterId": 1,
        "chapterTitle": "Chương 1. Khái niệm cơ bản về cảnh quan và kiến trúc cảnh quan",
        "questionNumber": 6,
        "title": "Cảnh quan đô thị và xu hướng phát triển trong tương lai",
        "coreConcept": "Tương lai cảnh quan đô thị phát triển theo 6 xu hướng: xanh hóa bền vững, thích ứng biến đổi khí hậu, đô thị thông minh, giữ gìn bản sắc, không gian công cộng linh hoạt và cộng đồng tham gia.",
        "keywords": [
            "xanh hóa và bền vững",
            "thích ứng biến đổi khí hậu",
            "đô thị thông minh",
            "giữ gìn bản sắc",
            "không gian công cộng linh hoạt công bằng",
            "cộng đồng tham gia",
            "hạ tầng xanh"
        ],
        "outline": [
            {
                "id": "p1",
                "order": 1,
                "heading": "Khái niệm cảnh quan đô thị",
                "details": [
                    "Cảnh quan đô thị là tổ hợp các yếu tố tự nhiên, nhân tạo, văn hóa và xã hội trong không gian đô thị (tương hỗ giữa vật lý và phi vật lý)."
                ],
                "keywords": [
                    "tổ hợp các yếu tố",
                    "tự nhiên",
                    "nhân tạo",
                    "văn hóa và xã hội"
                ],
                "content": "Cảnh quan đô thị là tổ hợp các yếu tố tự nhiên, nhân tạo, văn hóa và xã hội trong không gian đô thị (tương hỗ giữa vật lý và phi vật lý)."
            },
            {
                "id": "p2",
                "order": 2,
                "heading": "Xanh hóa và bền vững",
                "details": [
                    "Tăng không gian xanh, hạ tầng xanh – xanh dương, vườn trên mái, vườn đứng, tiết kiệm tài nguyên, giảm tác động môi trường."
                ],
                "keywords": [
                    "không gian xanh",
                    "hạ tầng xanh – xanh dương",
                    "vườn trên mái",
                    "vườn đứng",
                    "tiết kiệm tài nguyên"
                ],
                "content": "Tăng không gian xanh, hạ tầng xanh – xanh dương, vườn trên mái, vườn đứng, tiết kiệm tài nguyên, giảm tác động môi trường."
            },
            {
                "id": "p3",
                "order": 3,
                "heading": "Thích ứng biến đổi khí hậu",
                "details": [
                    "Tăng bề mặt thấm, cây xanh, hồ điều hòa, khả năng trữ nước; giảm đảo nhiệt đô thị."
                ],
                "keywords": [
                    "bề mặt thấm",
                    "hồ điều hòa",
                    "trữ nước",
                    "giảm đảo nhiệt đô thị"
                ],
                "content": "Tăng bề mặt thấm, cây xanh, hồ điều hòa, khả năng trữ nước; giảm đảo nhiệt đô thị."
            },
            {
                "id": "p4",
                "order": 4,
                "heading": "Đô thị thông minh",
                "details": [
                    "Ứng dụng công nghệ số trong quản lý, chiếu sáng, giám sát môi trường."
                ],
                "keywords": [
                    "đô thị thông minh",
                    "công nghệ số",
                    "chiếu sáng",
                    "giám sát môi trường"
                ],
                "content": "Ứng dụng công nghệ số trong quản lý, chiếu sáng, giám sát môi trường."
            },
            {
                "id": "p5",
                "order": 5,
                "heading": "Giữ gìn bản sắc",
                "details": [
                    "Phát huy văn hóa, lịch sử đặc trưng, bảo tồn di sản, tái sử dụng công trình và đất công nghiệp cũ."
                ],
                "keywords": [
                    "giữ gìn bản sắc",
                    "bảo tồn di sản",
                    "tái sử dụng công trình cũ"
                ],
                "content": "Phát huy văn hóa, lịch sử đặc trưng, bảo tồn di sản, tái sử dụng công trình và đất công nghiệp cũ."
            },
            {
                "id": "p6",
                "order": 6,
                "heading": "Không gian công cộng linh hoạt, công bằng",
                "details": [
                    "Đa chức năng, ưu tiên người đi bộ, mọi cư dân dễ tiếp cận dịch vụ và tiện ích."
                ],
                "keywords": [
                    "đa chức năng",
                    "ưu tiên người đi bộ",
                    "tiếp cận dịch vụ và tiện ích"
                ],
                "content": "Đa chức năng, ưu tiên người đi bộ, mọi cư dân dễ tiếp cận dịch vụ và tiện ích."
            },
            {
                "id": "p7",
                "order": 7,
                "heading": "Cộng đồng tham gia",
                "details": [
                    "Quyết định về không gian được công khai, minh bạch, phản ánh nhu cầu thực tế của cư dân."
                ],
                "keywords": [
                    "cộng đồng tham gia",
                    "công khai minh bạch",
                    "nhu cầu thực tế"
                ],
                "content": "Quyết định về không gian được công khai, minh bạch, phản ánh nhu cầu thực tế của cư dân."
            }
        ],
        "globalIndex": 6,
        "chapterIndex": 6,
        "coreSummary": "Tương lai cảnh quan đô thị phát triển theo 6 xu hướng: xanh hóa bền vững, thích ứng biến đổi khí hậu, đô thị thông minh, giữ gìn bản sắc, không gian công cộng linh hoạt và cộng đồng tham gia."
    },
    {
        "id": 7,
        "chapterId": 1,
        "chapterTitle": "Chương 1. Khái niệm cơ bản về cảnh quan và kiến trúc cảnh quan",
        "questionNumber": 7,
        "title": "Cảnh quan nông thôn và phân biệt với cảnh quan đô thị",
        "coreConcept": "Cảnh quan nông thôn hình thành từ sản xuất nông – lâm – ngư nghiệp với mật độ thấp và nhịp sống mùa vụ, đối lập với cảnh quan đô thị tập trung mật độ cao và nhịp sống liên tục.",
        "keywords": [
            "cảnh quan nông thôn",
            "cảnh quan đô thị",
            "nông – lâm – ngư nghiệp",
            "làng xóm",
            "mật độ phân tán",
            "không gian xanh liên tục",
            "nhịp sống mùa vụ"
        ],
        "table": {
            "headers": [
                "Tiêu chí",
                "Cảnh quan nông thôn",
                "Cảnh quan đô thị"
            ],
            "rows": [
                [
                    "Thành phần chủ đạo",
                    "Đồng ruộng, vườn, ao hồ, rừng, làng xóm",
                    "Công trình, đường phố, công viên, quảng trường"
                ],
                [
                    "Mật độ xây dựng, dân cư",
                    "Thấp, phân tán",
                    "Cao, tập trung"
                ],
                [
                    "Chức năng chính",
                    "Sản xuất nông – lâm – ngư nghiệp, sinh sống",
                    "Hành chính, thương mại, dịch vụ, công nghiệp, văn hóa"
                ],
                [
                    "Quan hệ nổi bật",
                    "Con người – môi trường tự nhiên",
                    "Con người – không gian xây dựng và hoạt động xã hội"
                ],
                [
                    "Hạ tầng",
                    "Hệ thống tưới tiêu, đường làng, kênh mương",
                    "Giao thông, cấp thoát nước, điện, công trình công cộng"
                ],
                [
                    "Không gian xanh",
                    "Là thiên nhiên và cây trồng, rộng và liên tục",
                    "Phải được tổ chức có chủ đích (công viên, vườn hoa, cây đường phố)"
                ],
                [
                    "Nhịp sống",
                    "Chậm, theo mùa vụ",
                    "Nhanh, liên tục"
                ]
            ]
        },
        "outline": [
            {
                "id": "p1",
                "order": 1,
                "heading": "Khái niệm, thành phần và vai trò cảnh quan nông thôn",
                "details": [
                    "Khái niệm: Cảnh quan nông thôn là cảnh quan của khu vực nông thôn, hình thành trên cơ sở hoạt động sản xuất nông – lâm – ngư nghiệp và sinh hoạt của cộng đồng; phản ánh rõ nhất mối quan hệ giữa con người với môi trường tự nhiên.",
                    "Thành phần: Gồm đồng ruộng, vườn, ao hồ, sông suối, rừng, làng xóm và hạ tầng nông nghiệp như hệ thống tưới tiêu.",
                    "Vai trò: Hỗ trợ sản xuất nông nghiệp, phát triển du lịch nông thôn và gìn giữ phong tục, tập quán, di sản địa phương."
                ],
                "keywords": [
                    "nông – lâm – ngư nghiệp",
                    "sinh hoạt cộng đồng",
                    "môi trường tự nhiên",
                    "hạ tầng nông nghiệp",
                    "gìn giữ di sản"
                ],
                "content": "Khái niệm: Cảnh quan nông thôn là cảnh quan của khu vực nông thôn, hình thành trên cơ sở hoạt động sản xuất nông – lâm – ngư nghiệp và sinh hoạt của cộng đồng; phản ánh rõ nhất mối quan hệ giữa con người với môi trường tự nhiên.\nThành phần: Gồm đồng ruộng, vườn, ao hồ, sông suối, rừng, làng xóm và hạ tầng nông nghiệp như hệ thống tưới tiêu.\nVai trò: Hỗ trợ sản xuất nông nghiệp, phát triển du lịch nông thôn và gìn giữ phong tục, tập quán, di sản địa phương."
            },
            {
                "id": "p2",
                "order": 2,
                "heading": "Bảng đối chiếu 7 tiêu chí phân biệt với cảnh quan đô thị",
                "details": [
                    "Phân biệt cảnh quan nông thôn và cảnh quan đô thị qua 7 tiêu chí: Thành phần chủ đạo, Mật độ xây dựng/dân cư, Chức năng chính, Quan hệ nổi bật, Hạ tầng, Không gian xanh và Nhịp sống."
                ],
                "keywords": [
                    "thành phần chủ đạo",
                    "mật độ",
                    "chức năng",
                    "quan hệ",
                    "hạ tầng",
                    "không gian xanh",
                    "nhịp sống"
                ],
                "content": "Phân biệt cảnh quan nông thôn và cảnh quan đô thị qua 7 tiêu chí: Thành phần chủ đạo, Mật độ xây dựng/dân cư, Chức năng chính, Quan hệ nổi bật, Hạ tầng, Không gian xanh và Nhịp sống."
            }
        ],
        "globalIndex": 7,
        "chapterIndex": 7,
        "coreSummary": "Cảnh quan nông thôn hình thành từ sản xuất nông – lâm – ngư nghiệp với mật độ thấp và nhịp sống mùa vụ, đối lập với cảnh quan đô thị tập trung mật độ cao và nhịp sống liên tục."
    },
    {
        "id": 8,
        "chapterId": 1,
        "chapterTitle": "Chương 1. Khái niệm cơ bản về cảnh quan và kiến trúc cảnh quan",
        "questionNumber": 8,
        "title": "Kiến trúc cảnh quan: khái niệm và vai trò",
        "coreConcept": "Kiến trúc cảnh quan kết hợp nghệ thuật, khoa học và kỹ thuật để tổ chức các không gian ngoài trời, giữ vai trò tạo dựng không gian sống, bảo vệ môi trường và bảo tồn tài nguyên, di sản.",
        "keywords": [
            "kiến trúc cảnh quan",
            "nghệ thuật – khoa học – kỹ thuật",
            "không gian ngoài trời",
            "tạo dựng không gian sống",
            "bảo vệ môi trường",
            "bảo tồn tài nguyên và di sản"
        ],
        "outline": [
            {
                "id": "p1",
                "order": 1,
                "heading": "Khái niệm kiến trúc cảnh quan",
                "details": [
                    "Kiến trúc cảnh quan là lĩnh vực kết hợp nghệ thuật, khoa học và kỹ thuật để nghiên cứu, quy hoạch, thiết kế, quản lý và bảo tồn các không gian ngoài trời như không gian mở, công viên, vườn, khu dân cư và đô thị, nhằm tạo môi trường sống tiện nghi, thẩm mỹ và bền vững."
                ],
                "keywords": [
                    "kết hợp nghệ thuật khoa học kỹ thuật",
                    "nghiên cứu quy hoạch thiết kế",
                    "không gian ngoài trời",
                    "tiện nghi thẩm mỹ bền vững"
                ],
                "content": "Kiến trúc cảnh quan là lĩnh vực kết hợp nghệ thuật, khoa học và kỹ thuật để nghiên cứu, quy hoạch, thiết kế, quản lý và bảo tồn các không gian ngoài trời như không gian mở, công viên, vườn, khu dân cư và đô thị, nhằm tạo môi trường sống tiện nghi, thẩm mỹ và bền vững."
            },
            {
                "id": "p2",
                "order": 2,
                "heading": "Vai trò Tạo dựng không gian sống",
                "details": [
                    "Tạo công viên, vườn hoa, không gian xanh và mở công cộng; đáp ứng công năng, thẩm mỹ, nhu cầu nghỉ ngơi, giao lưu; nâng cao sức khỏe và chất lượng sống."
                ],
                "keywords": [
                    "tạo công viên vườn hoa",
                    "đáp ứng công năng thẩm mỹ",
                    "nghỉ ngơi giao lưu",
                    "nâng cao sức khỏe"
                ],
                "content": "Tạo công viên, vườn hoa, không gian xanh và mở công cộng; đáp ứng công năng, thẩm mỹ, nhu cầu nghỉ ngơi, giao lưu; nâng cao sức khỏe và chất lượng sống."
            },
            {
                "id": "p3",
                "order": 3,
                "heading": "Vai trò Bảo vệ môi trường",
                "details": [
                    "Điều hòa vi khí hậu, giảm ô nhiễm không khí, tăng khả năng thấm và trữ nước, hỗ trợ đa dạng sinh học, thích ứng biến đổi khí hậu."
                ],
                "keywords": [
                    "điều hòa vi khí hậu",
                    "giảm ô nhiễm",
                    "thấm và trữ nước",
                    "đa dạng sinh học",
                    "thích ứng khí hậu"
                ],
                "content": "Điều hòa vi khí hậu, giảm ô nhiễm không khí, tăng khả năng thấm và trữ nước, hỗ trợ đa dạng sinh học, thích ứng biến đổi khí hậu."
            },
            {
                "id": "p4",
                "order": 4,
                "heading": "Vai trò Bảo tồn tài nguyên và di sản",
                "details": [
                    "Bảo vệ tài nguyên thiên nhiên và di sản văn hóa, tạo bản sắc cho không gian."
                ],
                "keywords": [
                    "bảo vệ tài nguyên thiên nhiên",
                    "di sản văn hóa",
                    "tạo bản sắc"
                ],
                "content": "Bảo vệ tài nguyên thiên nhiên và di sản văn hóa, tạo bản sắc cho không gian."
            }
        ],
        "globalIndex": 8,
        "chapterIndex": 8,
        "coreSummary": "Kiến trúc cảnh quan kết hợp nghệ thuật, khoa học và kỹ thuật để tổ chức các không gian ngoài trời, giữ vai trò tạo dựng không gian sống, bảo vệ môi trường và bảo tồn tài nguyên, di sản."
    },
    {
        "id": 9,
        "chapterId": 1,
        "chapterTitle": "Chương 1. Khái niệm cơ bản về cảnh quan và kiến trúc cảnh quan",
        "questionNumber": 9,
        "title": "Phân biệt kiến trúc cảnh quan với kiến trúc công trình",
        "coreConcept": "Kiến trúc cảnh quan tổ chức không gian ngoài trời biến đổi sống động theo mùa, trong khi kiến trúc công trình xây dựng các thực thể kiên cố tĩnh tại bằng bê tông, thép, gạch, kính.",
        "keywords": [
            "kiến trúc cảnh quan",
            "kiến trúc công trình",
            "không gian ngoài trời",
            "công trình xây dựng",
            "vật liệu sống động",
            "hình khối kết cấu",
            "quan hệ tương hỗ"
        ],
        "table": {
            "headers": [
                "Tiêu chí",
                "Kiến trúc cảnh quan",
                "Kiến trúc công trình"
            ],
            "rows": [
                [
                    "Đối tượng",
                    "Không gian ngoài trời: công viên, vườn, quảng trường, đường phố, khu đô thị",
                    "Công trình xây dựng: nhà ở, nhà hát, trường học, văn phòng"
                ],
                [
                    "Vật liệu chủ đạo",
                    "Địa hình, cây xanh, mặt nước kết hợp vật liệu lát, tiểu cảnh",
                    "Bê tông, thép, gạch, kính"
                ],
                [
                    "Tính chất",
                    "Sống động, biến đổi theo thời gian và mùa",
                    "Tương đối ổn định sau khi hoàn thành"
                ],
                [
                    "Trọng tâm",
                    "Tổ chức tổng thể không gian mở, quan hệ giữa con người, thiên nhiên và công trình",
                    "Hình khối, kết cấu, công năng và không gian bên trong"
                ],
                [
                    "Quy mô",
                    "Từ sân vườn nhỏ đến vùng, đô thị",
                    "Thường trong phạm vi một công trình hoặc cụm công trình"
                ]
            ]
        },
        "outline": [
            {
                "id": "p1",
                "order": 1,
                "heading": "Bảng đối chiếu 5 tiêu chí phân biệt",
                "details": [
                    "Phân biệt kiến trúc cảnh quan và kiến trúc công trình qua 5 tiêu chí: Đối tượng, Vật liệu chủ đạo, Tính chất, Trọng tâm và Quy mô."
                ],
                "keywords": [
                    "đối tượng",
                    "vật liệu chủ đạo",
                    "tính chất",
                    "trọng tâm",
                    "quy mô"
                ],
                "content": "Phân biệt kiến trúc cảnh quan và kiến trúc công trình qua 5 tiêu chí: Đối tượng, Vật liệu chủ đạo, Tính chất, Trọng tâm và Quy mô."
            },
            {
                "id": "p2",
                "order": 2,
                "heading": "Mối quan hệ tương hỗ và ví dụ thực tế",
                "details": [
                    "Ví dụ minh họa: Nhà hát Lớn Hà Nội (phong cách tân cổ điển Pháp) là kiến trúc công trình, còn không gian quảng trường, vườn hoa, cây xanh quanh nhà hát thuộc kiến trúc cảnh quan.",
                    "Tương tự, lăng Taj Mahal là kiến trúc công trình, còn vườn Chahar Bagh trước lăng là kiến trúc cảnh quan.",
                    "Hai lĩnh vực có quan hệ tương hỗ, cùng tạo nên không gian tổng thể."
                ],
                "keywords": [
                    "Nhà hát Lớn Hà Nội",
                    "quảng trường vườn hoa",
                    "Taj Mahal",
                    "vườn Chahar Bagh",
                    "quan hệ tương hỗ",
                    "không gian tổng thể"
                ],
                "content": "Ví dụ minh họa: Nhà hát Lớn Hà Nội (phong cách tân cổ điển Pháp) là kiến trúc công trình, còn không gian quảng trường, vườn hoa, cây xanh quanh nhà hát thuộc kiến trúc cảnh quan.\nTương tự, lăng Taj Mahal là kiến trúc công trình, còn vườn Chahar Bagh trước lăng là kiến trúc cảnh quan.\nHai lĩnh vực có quan hệ tương hỗ, cùng tạo nên không gian tổng thể."
            }
        ],
        "globalIndex": 9,
        "chapterIndex": 9,
        "coreSummary": "Kiến trúc cảnh quan tổ chức không gian ngoài trời biến đổi sống động theo mùa, trong khi kiến trúc công trình xây dựng các thực thể kiên cố tĩnh tại bằng bê tông, thép, gạch, kính."
    },
    {
        "id": 10,
        "chapterId": 1,
        "chapterTitle": "Chương 1. Khái niệm cơ bản về cảnh quan và kiến trúc cảnh quan",
        "questionNumber": 10,
        "title": "Khái niệm kiến trúc cảnh quan và các đối tượng hướng đến",
        "coreConcept": "Kiến trúc cảnh quan hướng tới cả đối tượng tự nhiên (sông núi, rừng, vùng đất ngập nước) và đối tượng nhân tạo (không gian mở công cộng, khu ở, không gian đô thị và vùng).",
        "keywords": [
            "đối tượng tự nhiên",
            "đối tượng nhân tạo",
            "không gian xanh công cộng",
            "không gian ở",
            "không gian đô thị và vùng",
            "đan xen tổng thể"
        ],
        "outline": [
            {
                "id": "p1",
                "order": 1,
                "heading": "Khái niệm kiến trúc cảnh quan",
                "details": [
                    "Kiến trúc cảnh quan là lĩnh vực kết hợp nghệ thuật, khoa học và kỹ thuật để tổ chức không gian ngoài trời (nghiên cứu, quy hoạch, thiết kế, quản lý và bảo tồn)."
                ],
                "keywords": [
                    "nghệ thuật",
                    "khoa học",
                    "kỹ thuật",
                    "tổ chức không gian ngoài trời"
                ],
                "content": "Kiến trúc cảnh quan là lĩnh vực kết hợp nghệ thuật, khoa học và kỹ thuật để tổ chức không gian ngoài trời (nghiên cứu, quy hoạch, thiết kế, quản lý và bảo tồn)."
            },
            {
                "id": "p2",
                "order": 2,
                "heading": "Đối tượng tự nhiên",
                "details": [
                    "Gồm núi đồi, sông hồ, biển, rừng, đất ngập nước, vườn quốc gia, khu bảo tồn.",
                    "Nhiệm vụ: bảo vệ, khai thác hợp lý, tạo điều kiện cho con người tiếp cận có kiểm soát."
                ],
                "keywords": [
                    "núi đồi",
                    "sông hồ",
                    "rừng",
                    "vườn quốc gia",
                    "bảo vệ khai thác hợp lý",
                    "tiếp cận có kiểm soát"
                ],
                "content": "Gồm núi đồi, sông hồ, biển, rừng, đất ngập nước, vườn quốc gia, khu bảo tồn.\nNhiệm vụ: bảo vệ, khai thác hợp lý, tạo điều kiện cho con người tiếp cận có kiểm soát."
            },
            {
                "id": "p3",
                "order": 3,
                "heading": "Đối tượng nhân tạo",
                "details": [
                    "Không gian xanh và mở công cộng: công viên, vườn hoa, quảng trường, tuyến phố, bờ sông hồ.",
                    "Không gian ở: khu dân cư, sân vườn nhà ở, khuôn viên công trình, vườn trên mái.",
                    "Không gian đô thị và vùng: khu đô thị, khu công nghiệp, khu du lịch, cảnh quan nông thôn."
                ],
                "keywords": [
                    "không gian xanh và mở công cộng",
                    "không gian ở",
                    "không gian đô thị và vùng"
                ],
                "content": "Không gian xanh và mở công cộng: công viên, vườn hoa, quảng trường, tuyến phố, bờ sông hồ.\nKhông gian ở: khu dân cư, sân vườn nhà ở, khuôn viên công trình, vườn trên mái.\nKhông gian đô thị và vùng: khu đô thị, khu công nghiệp, khu du lịch, cảnh quan nông thôn."
            },
            {
                "id": "p4",
                "order": 4,
                "heading": "Đặc điểm đan xen tổng thể",
                "details": [
                    "Các đối tượng này thường đan xen nhau, vì vậy kiến trúc cảnh quan phải xét tổng thể cả yếu tố tự nhiên lẫn nhân tạo."
                ],
                "keywords": [
                    "đan xen nhau",
                    "xét tổng thể",
                    "yếu tố tự nhiên",
                    "yếu tố nhân tạo"
                ],
                "content": "Các đối tượng này thường đan xen nhau, vì vậy kiến trúc cảnh quan phải xét tổng thể cả yếu tố tự nhiên lẫn nhân tạo."
            }
        ],
        "globalIndex": 10,
        "chapterIndex": 10,
        "coreSummary": "Kiến trúc cảnh quan hướng tới cả đối tượng tự nhiên (sông núi, rừng, vùng đất ngập nước) và đối tượng nhân tạo (không gian mở công cộng, khu ở, không gian đô thị và vùng)."
    },
    {
        "id": 11,
        "chapterId": 1,
        "chapterTitle": "Chương 1. Khái niệm cơ bản về cảnh quan và kiến trúc cảnh quan",
        "questionNumber": 11,
        "title": "Quy hoạch cảnh quan; phân biệt với thiết kế cảnh quan và kiến trúc cảnh quan",
        "coreConcept": "Quy hoạch cảnh quan tổ chức và quản lý không gian cấp vĩ mô, thiết kế cảnh quan đi sâu chi tiết vi mô, và cả hai đều là các chuyên ngành bộ phận của kiến trúc cảnh quan.",
        "keywords": [
            "quy hoạch cảnh quan",
            "thiết kế cảnh quan",
            "kiến trúc cảnh quan",
            "cấp tổng thể",
            "chi tiết không gian",
            "khung định hướng",
            "cụ thể hóa"
        ],
        "table": {
            "headers": [
                "Tiêu chí",
                "Quy hoạch cảnh quan",
                "Thiết kế cảnh quan",
                "Kiến trúc cảnh quan"
            ],
            "rows": [
                [
                    "Bản chất",
                    "Tổ chức, quản lý không gian ở cấp tổng thể",
                    "Đi sâu tổ chức chi tiết một không gian cụ thể",
                    "Lĩnh vực chung bao trùm cả quy hoạch và thiết kế"
                ],
                [
                    "Quy mô",
                    "Lớn: vùng, đô thị",
                    "Nhỏ đến vừa: công viên, quảng trường, sân vườn",
                    "Mọi quy mô"
                ],
                [
                    "Nội dung",
                    "Phân vùng, định hướng, nguyên tắc bảo tồn, hệ thống không gian xanh",
                    "Bố cục, cây xanh, mặt nước, vật liệu, ánh sáng, tiểu cảnh",
                    "Nghiên cứu, quy hoạch, thiết kế, quản lý, bảo tồn"
                ],
                [
                    "Sản phẩm",
                    "Sơ đồ, bản vẽ quy hoạch, quy định quản lý",
                    "Bản vẽ thiết kế chi tiết, hồ sơ thi công",
                    "Hệ thống kiến thức, phương pháp và các sản phẩm trên"
                ]
            ]
        },
        "outline": [
            {
                "id": "p1",
                "order": 1,
                "heading": "Khái niệm quy hoạch cảnh quan",
                "details": [
                    "Quy hoạch cảnh quan là việc tổ chức và quản lý không gian trên phạm vi tổng thể: xác định chức năng, phân vùng, bảo vệ tài nguyên và định hướng sử dụng đất cho một vùng hoặc đô thị."
                ],
                "keywords": [
                    "tổ chức quản lý không gian",
                    "phạm vi tổng thể",
                    "phân vùng",
                    "bảo vệ tài nguyên",
                    "định hướng sử dụng đất"
                ],
                "content": "Quy hoạch cảnh quan là việc tổ chức và quản lý không gian trên phạm vi tổng thể: xác định chức năng, phân vùng, bảo vệ tài nguyên và định hướng sử dụng đất cho một vùng hoặc đô thị."
            },
            {
                "id": "p2",
                "order": 2,
                "heading": "Bảng đối chiếu 4 tiêu chí so sánh",
                "details": [
                    "Phân biệt ba khái niệm qua 4 tiêu chí: Bản chất, Quy mô, Nội dung và Sản phẩm đầu ra."
                ],
                "keywords": [
                    "bản chất",
                    "quy mô",
                    "nội dung",
                    "sản phẩm"
                ],
                "content": "Phân biệt ba khái niệm qua 4 tiêu chí: Bản chất, Quy mô, Nội dung và Sản phẩm đầu ra."
            },
            {
                "id": "p3",
                "order": 3,
                "heading": "Mối quan hệ mật thiết",
                "details": [
                    "Quy hoạch định hướng khung cho thiết kế; thiết kế cụ thể hóa quy hoạch; cả hai thuộc lĩnh vực kiến trúc cảnh quan."
                ],
                "keywords": [
                    "định hướng khung",
                    "cụ thể hóa",
                    "thuộc lĩnh vực kiến trúc cảnh quan"
                ],
                "content": "Quy hoạch định hướng khung cho thiết kế; thiết kế cụ thể hóa quy hoạch; cả hai thuộc lĩnh vực kiến trúc cảnh quan."
            }
        ],
        "globalIndex": 11,
        "chapterIndex": 11,
        "coreSummary": "Quy hoạch cảnh quan tổ chức và quản lý không gian cấp vĩ mô, thiết kế cảnh quan đi sâu chi tiết vi mô, và cả hai đều là các chuyên ngành bộ phận của kiến trúc cảnh quan."
    },
    {
        "id": 12,
        "chapterId": 1,
        "chapterTitle": "Chương 1. Khái niệm cơ bản về cảnh quan và kiến trúc cảnh quan",
        "questionNumber": 12,
        "title": "Thiết kế cảnh quan: các yếu tố tạo nên và vai trò",
        "coreConcept": "Thiết kế cảnh quan là tổ chức chi tiết không gian cụ thể bằng 6 yếu tố (địa hình, thực vật, mặt nước, tiểu cảnh, giao thông, ánh sáng/màu sắc) theo cấu trúc nền – tường – trần.",
        "keywords": [
            "thiết kế cảnh quan",
            "địa hình",
            "thực vật",
            "mặt nước",
            "công trình tiểu cảnh",
            "giao thông đường dạo",
            "ánh sáng màu sắc",
            "nền – tường – trần"
        ],
        "outline": [
            {
                "id": "p1",
                "order": 1,
                "heading": "Khái niệm thiết kế cảnh quan",
                "details": [
                    "Thiết kế cảnh quan là việc đi sâu tổ chức chi tiết một không gian cụ thể (công viên, quảng trường, sân vườn, đường phố…), hài hòa giữa công năng, thẩm mỹ, sinh thái và văn hóa."
                ],
                "keywords": [
                    "tổ chức chi tiết",
                    "không gian cụ thể",
                    "công năng thẩm mỹ sinh thái văn hóa"
                ],
                "content": "Thiết kế cảnh quan là việc đi sâu tổ chức chi tiết một không gian cụ thể (công viên, quảng trường, sân vườn, đường phố…), hài hòa giữa công năng, thẩm mỹ, sinh thái và văn hóa."
            },
            {
                "id": "p2",
                "order": 2,
                "heading": "6 yếu tố tạo nên và vai trò",
                "details": [
                    "Địa hình: tạo khung nền, độ cao thấp, phân chia và định hình không gian, ảnh hưởng đến thoát nước và tầm nhìn.",
                    "Thực vật (cây xanh, thảm cỏ): tạo bóng mát, điều hòa vi khí hậu, hỗ trợ đa dạng sinh học, tạo vẻ đẹp theo mùa; có thể đóng vai trò mặt đứng (hàng cây) hoặc mặt trần (tán cây).",
                    "Mặt nước: điều hòa vi khí hậu, tạo phản chiếu, âm thanh, tăng giá trị thẩm mỹ.",
                    "Công trình và tiểu cảnh (cổng, đình, giàn che, tượng, ghế, đài phun nước): tạo điểm nhấn, đáp ứng công năng nghỉ ngơi, sinh hoạt.",
                    "Giao thông, đường dạo và vật liệu lát nền: tổ chức tuyến di chuyển, dẫn hướng tầm nhìn, đảm bảo an toàn và khả năng tiếp cận.",
                    "Ánh sáng, màu sắc và vật liệu: tạo không khí, nhấn mạnh điểm nhìn, kéo dài thời gian sử dụng không gian."
                ],
                "keywords": [
                    "địa hình",
                    "thực vật",
                    "mặt nước",
                    "công trình và tiểu cảnh",
                    "giao thông và vật liệu lát",
                    "ánh sáng màu sắc"
                ],
                "content": "Địa hình: tạo khung nền, độ cao thấp, phân chia và định hình không gian, ảnh hưởng đến thoát nước và tầm nhìn.\nThực vật (cây xanh, thảm cỏ): tạo bóng mát, điều hòa vi khí hậu, hỗ trợ đa dạng sinh học, tạo vẻ đẹp theo mùa; có thể đóng vai trò mặt đứng (hàng cây) hoặc mặt trần (tán cây).\nMặt nước: điều hòa vi khí hậu, tạo phản chiếu, âm thanh, tăng giá trị thẩm mỹ.\nCông trình và tiểu cảnh (cổng, đình, giàn che, tượng, ghế, đài phun nước): tạo điểm nhấn, đáp ứng công năng nghỉ ngơi, sinh hoạt.\nGiao thông, đường dạo và vật liệu lát nền: tổ chức tuyến di chuyển, dẫn hướng tầm nhìn, đảm bảo an toàn và khả năng tiếp cận.\nÁnh sáng, màu sắc và vật liệu: tạo không khí, nhấn mạnh điểm nhìn, kéo dài thời gian sử dụng không gian."
            },
            {
                "id": "p3",
                "order": 3,
                "heading": "Nguyên lý tổ hợp không gian: Nền – Tường – Trần",
                "details": [
                    "Tất cả được phối hợp theo ba thành phần không gian là nền, tường (mặt đứng) và trần, sao cho cân bằng, hài hòa và có tỷ lệ phù hợp."
                ],
                "keywords": [
                    "ba thành phần không gian",
                    "nền",
                    "tường mặt đứng",
                    "trần",
                    "cân bằng hài hòa"
                ],
                "content": "Tất cả được phối hợp theo ba thành phần không gian là nền, tường (mặt đứng) và trần, sao cho cân bằng, hài hòa và có tỷ lệ phù hợp."
            }
        ],
        "globalIndex": 12,
        "chapterIndex": 12,
        "coreSummary": "Thiết kế cảnh quan là tổ chức chi tiết không gian cụ thể bằng 6 yếu tố (địa hình, thực vật, mặt nước, tiểu cảnh, giao thông, ánh sáng/màu sắc) theo cấu trúc nền – tường – trần."
    },
    {
        "id": 13,
        "chapterId": 2,
        "chapterTitle": "Chương 2. Sự hình thành và phát triển của kiến trúc cảnh quan",
        "questionNumber": 1,
        "title": "Thời kỳ tiền công nghiệp",
        "coreConcept": "Thời kỳ tiền công nghiệp đặc trưng bởi các phong cách vườn thủ công khép kín phục vụ vua chúa, tôn giáo, mang bản sắc riêng biệt của từng nền văn minh.",
        "keywords": [
            "tiền công nghiệp",
            "tôn giáo quyền lực",
            "vườn khép kín",
            "Ai Cập",
            "Babylon",
            "La Mã",
            "Ấn Độ – Ba Tư",
            "Phục Hưng Ý",
            "Pháp",
            "Trung Quốc",
            "Nhật Bản",
            "Việt Nam",
            "Anh"
        ],
        "outline": [
            {
                "id": "p1",
                "order": 1,
                "heading": "Đặc trưng chung của thời kỳ tiền công nghiệp",
                "details": [
                    "Cảnh quan gắn chặt với tôn giáo, quyền lực và điều kiện tự nhiên; chủ yếu phục vụ vua chúa, quý tộc, đền đài, cung điện.",
                    "Hình thức mang tính khép kín, ít chức năng công cộng, xây dựng thủ công."
                ],
                "keywords": [
                    "tôn giáo",
                    "quyền lực",
                    "phục vụ vua chúa quý tộc",
                    "khép kín",
                    "xây dựng thủ công"
                ],
                "content": "Cảnh quan gắn chặt với tôn giáo, quyền lực và điều kiện tự nhiên; chủ yếu phục vụ vua chúa, quý tộc, đền đài, cung điện.\nHình thức mang tính khép kín, ít chức năng công cộng, xây dựng thủ công."
            },
            {
                "id": "p2",
                "order": 2,
                "heading": "Các kiểu vườn tiêu biểu theo từng nền văn minh",
                "details": [
                    "Ai Cập cổ đại: bể nước làm trung tâm, bố cục ba lớp lồng vào nhau.",
                    "Babylon: vườn treo trên các tầng cao.",
                    "La Mã cổ đại: vườn Peryxtyl, sân trong có hàng cột.",
                    "Ấn Độ – Ba Tư: Taj Mahal theo Chahar Bagh (vườn tứ phân), có trục, đối xứng, lăng đặt cuối vườn.",
                    "Phục Hưng Ý: khai thác địa hình dốc và trọng lực, dùng nước tạo vẻ đẹp và âm thanh.",
                    "Pháp: địa hình bằng phẳng, hình học, có trục, cây cắt tỉa (Versailles).",
                    "Trung Quốc: thiên nhiên thu nhỏ có hàm ý biểu tượng (núi đá, mặt nước, cây, kiến trúc).",
                    "Nhật Bản: vườn khô (Karesansui), vườn đồi, vườn dạo, vườn trà.",
                    "Việt Nam: nhà vườn Huế, nhà truyền thống Bắc Bộ.",
                    "Anh: vườn phong cảnh tự nhiên hóa với đường cong và mặt nước mềm mại (Stowe)."
                ],
                "keywords": [
                    "Ai Cập",
                    "Babylon",
                    "La Mã Peryxtyl",
                    "Chahar Bagh",
                    "Phục Hưng Ý",
                    "Versailles",
                    "Trung Quốc",
                    "Karesansui",
                    "nhà vườn Huế",
                    "vườn phong cảnh Anh"
                ],
                "content": "Ai Cập cổ đại: bể nước làm trung tâm, bố cục ba lớp lồng vào nhau.\nBabylon: vườn treo trên các tầng cao.\nLa Mã cổ đại: vườn Peryxtyl, sân trong có hàng cột.\nẤn Độ – Ba Tư: Taj Mahal theo Chahar Bagh (vườn tứ phân), có trục, đối xứng, lăng đặt cuối vườn.\nPhục Hưng Ý: khai thác địa hình dốc và trọng lực, dùng nước tạo vẻ đẹp và âm thanh.\nPháp: địa hình bằng phẳng, hình học, có trục, cây cắt tỉa (Versailles).\nTrung Quốc: thiên nhiên thu nhỏ có hàm ý biểu tượng (núi đá, mặt nước, cây, kiến trúc).\nNhật Bản: vườn khô (Karesansui), vườn đồi, vườn dạo, vườn trà.\nViệt Nam: nhà vườn Huế, nhà truyền thống Bắc Bộ.\nAnh: vườn phong cảnh tự nhiên hóa với đường cong và mặt nước mềm mại (Stowe)."
            },
            {
                "id": "p3",
                "order": 3,
                "heading": "Các yếu tố ảnh hưởng",
                "details": [
                    "Tôn giáo, tín ngưỡng; quyền lực chính trị và tầng lớp thống trị; điều kiện tự nhiên (khí hậu, địa hình, nguồn nước); triết lý, văn hóa, tư tưởng (như tư tưởng nhân văn thời Phục Hưng); trình độ kỹ thuật và kinh tế."
                ],
                "keywords": [
                    "tôn giáo tín ngưỡng",
                    "quyền lực chính trị",
                    "điều kiện tự nhiên",
                    "triết lý văn hóa",
                    "trình độ kỹ thuật kinh tế"
                ],
                "content": "Tôn giáo, tín ngưỡng; quyền lực chính trị và tầng lớp thống trị; điều kiện tự nhiên (khí hậu, địa hình, nguồn nước); triết lý, văn hóa, tư tưởng (như tư tưởng nhân văn thời Phục Hưng); trình độ kỹ thuật và kinh tế."
            }
        ],
        "globalIndex": 13,
        "chapterIndex": 1,
        "coreSummary": "Thời kỳ tiền công nghiệp đặc trưng bởi các phong cách vườn thủ công khép kín phục vụ vua chúa, tôn giáo, mang bản sắc riêng biệt của từng nền văn minh."
    },
    {
        "id": 14,
        "chapterId": 2,
        "chapterTitle": "Chương 2. Sự hình thành và phát triển của kiến trúc cảnh quan",
        "questionNumber": 2,
        "title": "Thời kỳ công nghiệp",
        "coreConcept": "Trước áp lực đô thị hóa và ô nhiễm môi trường thời kỳ công nghiệp, công viên đô thị công cộng thế kỷ XIX ra đời để phục vụ cộng đồng và mở rộng thành hệ thống không gian xanh.",
        "keywords": [
            "thời kỳ công nghiệp",
            "đô thị hóa nhanh",
            "ô nhiễm môi trường",
            "công viên đô thị công cộng thế kỷ XIX",
            "Central Park New York",
            "hệ thống không gian xanh",
            "kiến trúc tân cổ điển"
        ],
        "outline": [
            {
                "id": "p1",
                "order": 1,
                "heading": "Bối cảnh lịch sử và nguyên nhân hình thành",
                "details": [
                    "Cách mạng công nghiệp làm đô thị hóa nhanh, dân cư tập trung, môi trường ô nhiễm, thiếu không gian xanh."
                ],
                "keywords": [
                    "cách mạng công nghiệp",
                    "đô thị hóa nhanh",
                    "môi trường ô nhiễm",
                    "thiếu không gian xanh"
                ],
                "content": "Cách mạng công nghiệp làm đô thị hóa nhanh, dân cư tập trung, môi trường ô nhiễm, thiếu không gian xanh."
            },
            {
                "id": "p2",
                "order": 2,
                "heading": "Đặc trưng nổi bật của cảnh quan thời kỳ công nghiệp",
                "details": [
                    "Công viên đô thị công cộng xuất hiện (thế kỷ XIX) để đáp ứng nhu cầu sức khỏe, nghỉ ngơi và cải thiện điều kiện sống; cảnh quan không còn là đặc quyền của giới quý tộc. Ví dụ tiêu biểu: Central Park (New York).",
                    "Quy mô cảnh quan mở rộng từ khu vườn sang quy hoạch hệ thống không gian xanh của đô thị.",
                    "Kiến trúc tân cổ điển lấy cảm hứng từ Hy Lạp và La Mã cổ đại phát triển (ví dụ Nhà hát Lớn Hà Nội theo phong cách tân cổ điển Pháp)."
                ],
                "keywords": [
                    "công viên đô thị công cộng",
                    "Central Park",
                    "hệ thống không gian xanh",
                    "kiến trúc tân cổ điển",
                    "Nhà hát Lớn Hà Nội"
                ],
                "content": "Công viên đô thị công cộng xuất hiện (thế kỷ XIX) để đáp ứng nhu cầu sức khỏe, nghỉ ngơi và cải thiện điều kiện sống; cảnh quan không còn là đặc quyền của giới quý tộc. Ví dụ tiêu biểu: Central Park (New York).\nQuy mô cảnh quan mở rộng từ khu vườn sang quy hoạch hệ thống không gian xanh của đô thị.\nKiến trúc tân cổ điển lấy cảm hứng từ Hy Lạp và La Mã cổ đại phát triển (ví dụ Nhà hát Lớn Hà Nội theo phong cách tân cổ điển Pháp)."
            },
            {
                "id": "p3",
                "order": 3,
                "heading": "Các yếu tố ảnh hưởng",
                "details": [
                    "Cách mạng công nghiệp và đô thị hóa; dân số tăng nhanh, nhu cầu cải thiện môi trường và sức khỏe; sự dân chủ hóa không gian công cộng; tiến bộ kỹ thuật, vật liệu, máy móc; các tư tưởng cải cách đô thị."
                ],
                "keywords": [
                    "dân số tăng nhanh",
                    "cải thiện môi trường sức khỏe",
                    "dân chủ hóa không gian công cộng",
                    "tiến bộ kỹ thuật vật liệu máy móc",
                    "cải cách đô thị"
                ],
                "content": "Cách mạng công nghiệp và đô thị hóa; dân số tăng nhanh, nhu cầu cải thiện môi trường và sức khỏe; sự dân chủ hóa không gian công cộng; tiến bộ kỹ thuật, vật liệu, máy móc; các tư tưởng cải cách đô thị."
            }
        ],
        "globalIndex": 14,
        "chapterIndex": 2,
        "coreSummary": "Trước áp lực đô thị hóa và ô nhiễm môi trường thời kỳ công nghiệp, công viên đô thị công cộng thế kỷ XIX ra đời để phục vụ cộng đồng và mở rộng thành hệ thống không gian xanh."
    },
    {
        "id": 15,
        "chapterId": 2,
        "chapterTitle": "Chương 2. Sự hình thành và phát triển của kiến trúc cảnh quan",
        "questionNumber": 3,
        "title": "Thời kỳ hậu công nghiệp",
        "coreConcept": "Thời kỳ hậu công nghiệp chú trọng kiến trúc xanh bền vững, tái sinh công trình công nghiệp cũ thành không gian công cộng, thích ứng biến đổi khí hậu và đề cao trải nghiệm cộng đồng.",
        "keywords": [
            "hậu công nghiệp",
            "kiến trúc xanh",
            "phát triển bền vững",
            "vườn trên mái",
            "vườn đứng",
            "tái sử dụng đất công nghiệp cũ",
            "High Line New York",
            "thích ứng biến đổi khí hậu",
            "công nghệ số"
        ],
        "outline": [
            {
                "id": "p1",
                "order": 1,
                "heading": "Đặc trưng phát triển của cảnh quan hậu công nghiệp",
                "details": [
                    "Hướng tới kiến trúc xanh và phát triển bền vững: vườn trên mái, vườn đứng, tăng diện tích sinh thái trong đô thị.",
                    "Cải tạo, tái sử dụng đất và công trình công nghiệp cũ thành không gian công cộng (ví dụ High Line ở New York).",
                    "Chú trọng thích ứng biến đổi khí hậu, bảo tồn đa dạng sinh học, ứng dụng công nghệ số.",
                    "Quan tâm đến trải nghiệm người sử dụng, bản sắc địa phương và sự tham gia của cộng đồng; kiến trúc và cảnh quan hòa quyện thành tổng thể."
                ],
                "keywords": [
                    "kiến trúc xanh bền vững",
                    "vườn trên mái",
                    "vườn đứng",
                    "tái sử dụng đất công nghiệp cũ",
                    "High Line",
                    "thích ứng biến đổi khí hậu",
                    "trải nghiệm người dùng"
                ],
                "content": "Hướng tới kiến trúc xanh và phát triển bền vững: vườn trên mái, vườn đứng, tăng diện tích sinh thái trong đô thị.\nCải tạo, tái sử dụng đất và công trình công nghiệp cũ thành không gian công cộng (ví dụ High Line ở New York).\nChú trọng thích ứng biến đổi khí hậu, bảo tồn đa dạng sinh học, ứng dụng công nghệ số.\nQuan tâm đến trải nghiệm người sử dụng, bản sắc địa phương và sự tham gia của cộng đồng; kiến trúc và cảnh quan hòa quyện thành tổng thể."
            },
            {
                "id": "p2",
                "order": 2,
                "heading": "Các yếu tố ảnh hưởng",
                "details": [
                    "Biến đổi khí hậu và ô nhiễm; nhận thức về môi trường và sức khỏe; chuyển dịch sang kinh tế dịch vụ, tri thức; công nghệ thông tin và vật liệu mới; toàn cầu hóa đi cùng nhu cầu giữ bản sắc; chính sách phát triển bền vững."
                ],
                "keywords": [
                    "biến đổi khí hậu",
                    "nhận thức môi trường",
                    "kinh tế dịch vụ tri thức",
                    "công nghệ thông tin vật liệu mới",
                    "toàn cầu hóa và bản sắc",
                    "chính sách bền vững"
                ],
                "content": "Biến đổi khí hậu và ô nhiễm; nhận thức về môi trường và sức khỏe; chuyển dịch sang kinh tế dịch vụ, tri thức; công nghệ thông tin và vật liệu mới; toàn cầu hóa đi cùng nhu cầu giữ bản sắc; chính sách phát triển bền vững."
            }
        ],
        "globalIndex": 15,
        "chapterIndex": 3,
        "coreSummary": "Thời kỳ hậu công nghiệp chú trọng kiến trúc xanh bền vững, tái sinh công trình công nghiệp cũ thành không gian công cộng, thích ứng biến đổi khí hậu và đề cao trải nghiệm cộng đồng."
    },
    {
        "id": 16,
        "chapterId": 2,
        "chapterTitle": "Chương 2. Sự hình thành và phát triển của kiến trúc cảnh quan",
        "questionNumber": 4,
        "title": "Mối quan hệ tương hỗ giữa kiến trúc cảnh quan và quy hoạch không gian",
        "coreConcept": "Quy hoạch không gian định hướng khung chức năng và quỹ đất, trong khi kiến trúc cảnh quan tạo cơ sở sinh thái và thẩm mỹ; hai bên phải triển khai song song phản hồi qua lại.",
        "keywords": [
            "quan hệ tương hỗ",
            "quy hoạch không gian",
            "kiến trúc cảnh quan",
            "khung định hướng",
            "cơ sở sinh thái",
            "thực hiện song song",
            "cấp vùng miền",
            "điểm dân cư"
        ],
        "outline": [
            {
                "id": "p1",
                "order": 1,
                "heading": "Mối quan hệ tương hỗ hai chiều",
                "details": [
                    "Quy hoạch không gian (vùng, đô thị, điểm dân cư) xác định khung chung: phân bố chức năng, quỹ đất, hạ tầng, mật độ xây dựng; đó là cơ sở định hướng cho kiến trúc cảnh quan.",
                    "Kiến trúc cảnh quan cung cấp cơ sở tự nhiên và sinh thái (địa hình, mặt nước, thảm thực vật), hệ thống không gian xanh – mở, bản sắc và chất lượng thẩm mỹ, giúp cụ thể hóa, điều chỉnh và hoàn thiện quy hoạch.",
                    "Hai lĩnh vực phải thực hiện song song và phản hồi qua lại, tránh quy hoạch xong mới bổ sung cây xanh như phần trang trí."
                ],
                "keywords": [
                    "khung chung",
                    "phân bố chức năng",
                    "cơ sở tự nhiên sinh thái",
                    "hệ thống không gian xanh – mở",
                    "thực hiện song song"
                ],
                "content": "Quy hoạch không gian (vùng, đô thị, điểm dân cư) xác định khung chung: phân bố chức năng, quỹ đất, hạ tầng, mật độ xây dựng; đó là cơ sở định hướng cho kiến trúc cảnh quan.\nKiến trúc cảnh quan cung cấp cơ sở tự nhiên và sinh thái (địa hình, mặt nước, thảm thực vật), hệ thống không gian xanh – mở, bản sắc và chất lượng thẩm mỹ, giúp cụ thể hóa, điều chỉnh và hoàn thiện quy hoạch.\nHai lĩnh vực phải thực hiện song song và phản hồi qua lại, tránh quy hoạch xong mới bổ sung cây xanh như phần trang trí."
            },
            {
                "id": "p2",
                "order": 2,
                "heading": "Vai trò quan trọng đối với vùng miền và điểm dân cư",
                "details": [
                    "Với vùng miền: bảo vệ tài nguyên đất, nước, rừng, đa dạng sinh học; cân bằng kinh tế – xã hội – môi trường; phát huy bản sắc vùng và tiềm năng du lịch.",
                    "Với điểm dân cư: nâng cao chất lượng sống; bảo đảm mọi cư dân dễ tiếp cận không gian công cộng và tiện ích; giữ bản sắc văn hóa; tăng khả năng thích ứng với biến đổi khí hậu."
                ],
                "keywords": [
                    "bảo vệ tài nguyên",
                    "cân bằng kinh tế – xã hội – môi trường",
                    "tiềm năng du lịch",
                    "chất lượng sống",
                    "tiếp cận công bằng",
                    "thích ứng biến đổi khí hậu"
                ],
                "content": "Với vùng miền: bảo vệ tài nguyên đất, nước, rừng, đa dạng sinh học; cân bằng kinh tế – xã hội – môi trường; phát huy bản sắc vùng và tiềm năng du lịch.\nVới điểm dân cư: nâng cao chất lượng sống; bảo đảm mọi cư dân dễ tiếp cận không gian công cộng và tiện ích; giữ bản sắc văn hóa; tăng khả năng thích ứng với biến đổi khí hậu."
            }
        ],
        "globalIndex": 16,
        "chapterIndex": 4,
        "coreSummary": "Quy hoạch không gian định hướng khung chức năng và quỹ đất, trong khi kiến trúc cảnh quan tạo cơ sở sinh thái và thẩm mỹ; hai bên phải triển khai song song phản hồi qua lại."
    },
    {
        "id": 17,
        "chapterId": 3,
        "chapterTitle": "Chương 3. Nguyên tắc bố cục, quy hoạch và thiết kế cảnh quan",
        "questionNumber": 1,
        "title": "Các quy luật bố cục chủ yếu và vai trò",
        "coreConcept": "Bố cục cảnh quan sắp xếp các thành phần thành tổng thể thống nhất dựa trên 5 quy luật bổ trợ nhau: Thống nhất, Tương phản, Cân bằng, Nhịp điệu và Tỷ lệ.",
        "keywords": [
            "bố cục cảnh quan",
            "thống nhất",
            "tương phản",
            "cân bằng đối xứng và bất đối xứng",
            "nhịp điệu",
            "tỷ lệ",
            "điểm nhìn",
            "tuyến nhìn",
            "trường nhìn"
        ],
        "outline": [
            {
                "id": "p1",
                "order": 1,
                "heading": "Khái niệm bố cục cảnh quan",
                "details": [
                    "Bố cục cảnh quan là sắp xếp các thành phần (địa hình, cây xanh, mặt nước, công trình, đường dạo…) thành một tổng thể thống nhất."
                ],
                "keywords": [
                    "sắp xếp các thành phần",
                    "tổng thể thống nhất"
                ],
                "content": "Bố cục cảnh quan là sắp xếp các thành phần (địa hình, cây xanh, mặt nước, công trình, đường dạo…) thành một tổng thể thống nhất."
            },
            {
                "id": "p2",
                "order": 2,
                "heading": "5 quy luật bố cục chủ yếu và vai trò",
                "details": [
                    "Thống nhất: các thành phần có quan hệ hài hòa trong một ý tưởng chung (cùng ngôn ngữ về hình dáng, vật liệu, màu sắc, chủ đề). Vai trò: tránh rời rạc, tạo tính toàn vẹn, dễ nhận biết. Thống nhất không có nghĩa là chỉ dùng một loại cây hay không có biến đổi.",
                    "Tương phản: đặt cạnh nhau các yếu tố khác biệt để làm nổi bật sự khác biệt và tạo điểm nhấn. Vai trò: tránh đơn điệu, thu hút sự chú ý, làm không gian sinh động.",
                    "Cân bằng: gồm cân bằng đối xứng (hai nửa giống nhau, tạo cảm giác trang trọng, ổn định, như Taj Mahal hay vườn Pháp) và cân bằng bất đối xứng (phân bố trọng lượng thị giác khác nhau nhưng tương đương, tạo vẻ tự nhiên, linh hoạt, như vườn Nhật hay vườn phong cảnh Anh). Vai trò: tạo cảm giác ổn định, dễ chịu.",
                    "Nhịp điệu: lặp lại có quy luật các yếu tố (hàng cây, cột đèn, bậc cấp, ô lát). Vai trò: dẫn dắt mắt nhìn, tạo cảm giác chuyển động, liên tục và định hướng.",
                    "Tỷ lệ: kích thước các yếu tố phù hợp với nhau và với con người. Vai trò: tạo cảm giác thoải mái, đúng thang đo, tránh quá nhỏ bé hoặc choáng ngợp."
                ],
                "keywords": [
                    "thống nhất",
                    "tương phản",
                    "cân bằng đối xứng",
                    "cân bằng bất đối xứng",
                    "nhịp điệu",
                    "tỷ lệ"
                ],
                "content": "Thống nhất: các thành phần có quan hệ hài hòa trong một ý tưởng chung (cùng ngôn ngữ về hình dáng, vật liệu, màu sắc, chủ đề). Vai trò: tránh rời rạc, tạo tính toàn vẹn, dễ nhận biết. Thống nhất không có nghĩa là chỉ dùng một loại cây hay không có biến đổi.\nTương phản: đặt cạnh nhau các yếu tố khác biệt để làm nổi bật sự khác biệt và tạo điểm nhấn. Vai trò: tránh đơn điệu, thu hút sự chú ý, làm không gian sinh động.\nCân bằng: gồm cân bằng đối xứng (hai nửa giống nhau, tạo cảm giác trang trọng, ổn định, như Taj Mahal hay vườn Pháp) và cân bằng bất đối xứng (phân bố trọng lượng thị giác khác nhau nhưng tương đương, tạo vẻ tự nhiên, linh hoạt, như vườn Nhật hay vườn phong cảnh Anh). Vai trò: tạo cảm giác ổn định, dễ chịu.\nNhịp điệu: lặp lại có quy luật các yếu tố (hàng cây, cột đèn, bậc cấp, ô lát). Vai trò: dẫn dắt mắt nhìn, tạo cảm giác chuyển động, liên tục và định hướng.\nTỷ lệ: kích thước các yếu tố phù hợp với nhau và với con người. Vai trò: tạo cảm giác thoải mái, đúng thang đo, tránh quá nhỏ bé hoặc choáng ngợp."
            },
            {
                "id": "p3",
                "order": 3,
                "heading": "Mối quan hệ bổ trợ và trải nghiệm thị giác",
                "details": [
                    "Các quy luật bổ sung cho nhau: thống nhất là nền tảng, các quy luật còn lại làm không gian có trật tự và sinh động mà không bị rời rạc.",
                    "Khi tổ chức bố cục còn cần dựa trên điểm nhìn, tuyến nhìn và trường nhìn để tạo trải nghiệm không gian liên tục, có chủ đích."
                ],
                "keywords": [
                    "bổ sung cho nhau",
                    "thống nhất là nền tảng",
                    "điểm nhìn",
                    "tuyến nhìn",
                    "trường nhìn",
                    "trải nghiệm liên tục"
                ],
                "content": "Các quy luật bổ sung cho nhau: thống nhất là nền tảng, các quy luật còn lại làm không gian có trật tự và sinh động mà không bị rời rạc.\nKhi tổ chức bố cục còn cần dựa trên điểm nhìn, tuyến nhìn và trường nhìn để tạo trải nghiệm không gian liên tục, có chủ đích."
            }
        ],
        "globalIndex": 17,
        "chapterIndex": 1,
        "coreSummary": "Bố cục cảnh quan sắp xếp các thành phần thành tổng thể thống nhất dựa trên 5 quy luật bổ trợ nhau: Thống nhất, Tương phản, Cân bằng, Nhịp điệu và Tỷ lệ."
    },
    {
        "id": 18,
        "chapterId": 3,
        "chapterTitle": "Chương 3. Nguyên tắc bố cục, quy hoạch và thiết kế cảnh quan",
        "questionNumber": 2,
        "title": "Khái niệm bố cục cảnh quan và quy luật tương phản",
        "coreConcept": "Bố cục cảnh quan dựa trên điểm nhìn, tuyến nhìn, trường nhìn; quy luật tương phản tạo điểm nhấn qua 5 dạng đối lập (hình dáng, kích thước, màu sắc/ánh sáng, chất liệu, trạng thái) trong sự thống nhất chung.",
        "keywords": [
            "bố cục cảnh quan",
            "điểm nhìn",
            "tuyến nhìn",
            "trường nhìn",
            "quy luật tương phản",
            "hình dáng",
            "kích thước",
            "màu sắc ánh sáng",
            "chất liệu",
            "trạng thái",
            "Karesansui",
            "Tháp Rùa"
        ],
        "outline": [
            {
                "id": "p1",
                "order": 1,
                "heading": "Khái niệm bố cục cảnh quan",
                "details": [
                    "Bố cục cảnh quan là sắp xếp các thành phần của cảnh quan thành một tổng thể thống nhất, dựa trên cơ sở là điểm nhìn (vị trí người quan sát), tuyến nhìn (hướng nhìn từ điểm nhìn tới đối tượng) và trường nhìn (phạm vi quan sát được từ một điểm nhìn)."
                ],
                "keywords": [
                    "sắp xếp các thành phần",
                    "tổng thể thống nhất",
                    "điểm nhìn",
                    "tuyến nhìn",
                    "trường nhìn"
                ],
                "content": "Bố cục cảnh quan là sắp xếp các thành phần của cảnh quan thành một tổng thể thống nhất, dựa trên cơ sở là điểm nhìn (vị trí người quan sát), tuyến nhìn (hướng nhìn từ điểm nhìn tới đối tượng) và trường nhìn (phạm vi quan sát được từ một điểm nhìn)."
            },
            {
                "id": "p2",
                "order": 2,
                "heading": "Quy luật tương phản và 5 dạng tương phản thường gặp",
                "details": [
                    "Quy luật tương phản là đặt cạnh nhau các yếu tố đối lập để làm nổi bật sự khác biệt và tạo điểm nhấn.",
                    "Hình dáng: đường cong mềm với hình khối thẳng.",
                    "Kích thước: cây cao với thảm cỏ thấp; công trình lớn với tiểu cảnh nhỏ.",
                    "Màu sắc và ánh sáng: sáng với tối, màu nóng với màu lạnh.",
                    "Chất liệu: mềm với cứng, nhám với nhẵn.",
                    "Trạng thái: mặt nước phẳng lặng với đài phun hay thác nước chuyển động."
                ],
                "keywords": [
                    "quy luật tương phản",
                    "hình dáng",
                    "kích thước",
                    "màu sắc và ánh sáng",
                    "chất liệu",
                    "trạng thái"
                ],
                "content": "Quy luật tương phản là đặt cạnh nhau các yếu tố đối lập để làm nổi bật sự khác biệt và tạo điểm nhấn.\nHình dáng: đường cong mềm với hình khối thẳng.\nKích thước: cây cao với thảm cỏ thấp; công trình lớn với tiểu cảnh nhỏ.\nMàu sắc và ánh sáng: sáng với tối, màu nóng với màu lạnh.\nChất liệu: mềm với cứng, nhám với nhẵn.\nTrạng thái: mặt nước phẳng lặng với đài phun hay thác nước chuyển động."
            },
            {
                "id": "p3",
                "order": 3,
                "heading": "4 ví dụ minh họa kinh điển",
                "details": [
                    "Vườn khô Nhật Bản (Karesansui): những khối đá thô, cứng nằm trên nền sỏi cát phẳng mịn.",
                    "Vườn Trung Quốc: núi đá gồ ghề đối lập với mặt nước phẳng lặng, kiến trúc thẳng đối lập với cây cong.",
                    "Taj Mahal: lăng trắng đồ sộ nổi bật giữa mặt nước phẳng và hàng cây xanh thẫm.",
                    "Hồ Hoàn Kiếm: Tháp Rùa nhỏ bé, vững chãi giữa mặt hồ rộng."
                ],
                "keywords": [
                    "Karesansui",
                    "Vườn Trung Quốc",
                    "Taj Mahal",
                    "Tháp Rùa Hồ Gươm"
                ],
                "content": "Vườn khô Nhật Bản (Karesansui): những khối đá thô, cứng nằm trên nền sỏi cát phẳng mịn.\nVườn Trung Quốc: núi đá gồ ghề đối lập với mặt nước phẳng lặng, kiến trúc thẳng đối lập với cây cong.\nTaj Mahal: lăng trắng đồ sộ nổi bật giữa mặt nước phẳng và hàng cây xanh thẫm.\nHồ Hoàn Kiếm: Tháp Rùa nhỏ bé, vững chãi giữa mặt hồ rộng."
            },
            {
                "id": "p4",
                "order": 4,
                "heading": "Lưu ý khi vận dụng tương phản",
                "details": [
                    "Tương phản phải vừa phải và nằm trong sự thống nhất chung; nếu quá nhiều sẽ gây rối mắt, rời rạc."
                ],
                "keywords": [
                    "vừa phải",
                    "thống nhất chung",
                    "tránh rối mắt rời rạc"
                ],
                "content": "Tương phản phải vừa phải và nằm trong sự thống nhất chung; nếu quá nhiều sẽ gây rối mắt, rời rạc."
            }
        ],
        "globalIndex": 18,
        "chapterIndex": 2,
        "coreSummary": "Bố cục cảnh quan dựa trên điểm nhìn, tuyến nhìn, trường nhìn; quy luật tương phản tạo điểm nhấn qua 5 dạng đối lập (hình dáng, kích thước, màu sắc/ánh sáng, chất liệu, trạng thái) trong sự thống nhất chung."
    },
    {
        "id": 19,
        "chapterId": 3,
        "chapterTitle": "Chương 3. Nguyên tắc bố cục, quy hoạch và thiết kế cảnh quan",
        "questionNumber": 3,
        "title": "Nguyên tắc phân vùng cảnh quan trong quy hoạch cảnh quan vùng",
        "coreConcept": "Quy hoạch cảnh quan vùng tuân thủ 10 nguyên tắc phân vùng chức năng theo sức chịu tải sinh thái và phân thành 4 nhóm cảnh quan chính.",
        "keywords": [
            "phân vùng cảnh quan vùng",
            "hiện trạng",
            "bảo tồn tài nguyên",
            "phát triển bền vững",
            "sử dụng đất hợp lý",
            "phân khu chức năng",
            "bảo vệ nguồn nước",
            "thích ứng biến đổi khí hậu",
            "tích hợp phối hợp",
            "cộng đồng tham gia",
            "bảo tồn văn hóa",
            "sơ đồ phân loại cảnh quan vùng"
        ],
        "diagram": "CẢNH QUAN VÙNG\n├── Cảnh quan thiên nhiên\n│   ├── Cảnh quan bảo tồn (vườn quốc gia, khu dự trữ thiên nhiên)\n│   └── Cảnh quan có giá trị nghệ thuật độc đáo (Ba Bể, Hạ Long)\n├── Cảnh quan sản xuất\n│   ├── Nông – lâm – ngư nghiệp (vùng trồng trọt, rừng, nuôi trồng)\n│   └── Vùng công nghiệp\n├── Cảnh quan điểm dân cư\n│   ├── Đô thị\n│   └── Nông thôn\n└── Cảnh quan du lịch – nghỉ dưỡng",
        "outline": [
            {
                "id": "p1",
                "order": 1,
                "heading": "10 nguyên tắc phân vùng cảnh quan vùng",
                "details": [
                    "Phân tích và đánh giá hiện trạng: đánh giá các yếu tố tự nhiên và nhân tạo trước khi quy hoạch.",
                    "Bảo tồn tài nguyên thiên nhiên: bảo vệ đất, nước, rừng và đa dạng sinh học.",
                    "Phát triển bền vững: cân bằng kinh tế, xã hội và môi trường.",
                    "Sử dụng đất hợp lý: phân bổ đất phù hợp chức năng và khả năng chịu tải, không khai thác tối đa mọi quỹ đất.",
                    "Phân khu chức năng: mỗi vùng có chức năng chính rõ ràng, hạn chế xung đột.",
                    "Bảo vệ nguồn nước: kiểm soát ô nhiễm, bảo vệ hành lang sông hồ.",
                    "Thích ứng biến đổi khí hậu: tăng không gian thấm, cây xanh và khả năng trữ nước.",
                    "Tích hợp và phối hợp: phối hợp các ngành, các cấp quản lý và các bên liên quan.",
                    "Cộng đồng tham gia: quyết định công khai, minh bạch, phản ánh nhu cầu thực tế.",
                    "Bảo tồn văn hóa: giữ gìn phong tục, tập quán và di sản địa phương."
                ],
                "keywords": [
                    "phân tích hiện trạng",
                    "bảo tồn tài nguyên",
                    "phát triển bền vững",
                    "sử dụng đất hợp lý",
                    "phân khu chức năng",
                    "bảo vệ nguồn nước",
                    "thích ứng khí hậu",
                    "cộng đồng tham gia",
                    "bảo tồn văn hóa"
                ],
                "content": "Phân tích và đánh giá hiện trạng: đánh giá các yếu tố tự nhiên và nhân tạo trước khi quy hoạch.\nBảo tồn tài nguyên thiên nhiên: bảo vệ đất, nước, rừng và đa dạng sinh học.\nPhát triển bền vững: cân bằng kinh tế, xã hội và môi trường.\nSử dụng đất hợp lý: phân bổ đất phù hợp chức năng và khả năng chịu tải, không khai thác tối đa mọi quỹ đất.\nPhân khu chức năng: mỗi vùng có chức năng chính rõ ràng, hạn chế xung đột.\nBảo vệ nguồn nước: kiểm soát ô nhiễm, bảo vệ hành lang sông hồ.\nThích ứng biến đổi khí hậu: tăng không gian thấm, cây xanh và khả năng trữ nước.\nTích hợp và phối hợp: phối hợp các ngành, các cấp quản lý và các bên liên quan.\nCộng đồng tham gia: quyết định công khai, minh bạch, phản ánh nhu cầu thực tế.\nBảo tồn văn hóa: giữ gìn phong tục, tập quán và di sản địa phương."
            },
            {
                "id": "p2",
                "order": 2,
                "heading": "Sơ đồ phân loại cảnh quan vùng",
                "details": [
                    "Phân loại cảnh quan vùng thành 4 nhánh chính: Cảnh quan thiên nhiên (bảo tồn, nghệ thuật độc đáo), Cảnh quan sản xuất (nông-lâm-ngư nghiệp, công nghiệp), Cảnh quan điểm dân cư (đô thị, nông thôn) và Cảnh quan du lịch – nghỉ dưỡng."
                ],
                "keywords": [
                    "cảnh quan thiên nhiên",
                    "cảnh quan sản xuất",
                    "cảnh quan điểm dân cư",
                    "cảnh quan du lịch – nghỉ dưỡng"
                ],
                "content": "Phân loại cảnh quan vùng thành 4 nhánh chính: Cảnh quan thiên nhiên (bảo tồn, nghệ thuật độc đáo), Cảnh quan sản xuất (nông-lâm-ngư nghiệp, công nghiệp), Cảnh quan điểm dân cư (đô thị, nông thôn) và Cảnh quan du lịch – nghỉ dưỡng."
            },
            {
                "id": "p3",
                "order": 3,
                "heading": "Căn cứ tự nhiên trong phân vùng",
                "details": [
                    "Khi phân vùng còn có thể dựa trên yếu tố tự nhiên: địa hình (đồi núi, đồng bằng), thủy văn (sông, hồ, kênh rạch, đầm lầy), thảm thực vật.",
                    "Cách chia nhóm có thể khác theo giáo trình, bạn nên đối chiếu với sơ đồ trong bài giảng của lớp."
                ],
                "keywords": [
                    "địa hình",
                    "thủy văn",
                    "thảm thực vật",
                    "đối chiếu giáo trình"
                ],
                "content": "Khi phân vùng còn có thể dựa trên yếu tố tự nhiên: địa hình (đồi núi, đồng bằng), thủy văn (sông, hồ, kênh rạch, đầm lầy), thảm thực vật.\nCách chia nhóm có thể khác theo giáo trình, bạn nên đối chiếu với sơ đồ trong bài giảng của lớp."
            }
        ],
        "globalIndex": 19,
        "chapterIndex": 3,
        "coreSummary": "Quy hoạch cảnh quan vùng tuân thủ 10 nguyên tắc phân vùng chức năng theo sức chịu tải sinh thái và phân thành 4 nhóm cảnh quan chính."
    },
    {
        "id": 20,
        "chapterId": 3,
        "chapterTitle": "Chương 3. Nguyên tắc bố cục, quy hoạch và thiết kế cảnh quan",
        "questionNumber": 4,
        "title": "Phân vùng cảnh quan đô thị và cơ sở hình thành quy hoạch",
        "coreConcept": "Phân vùng cảnh quan đô thị gồm 8 phân khu chức năng đan xen, được xác lập dựa trên 5 cơ sở khoa học về tự nhiên, hiện trạng, văn hóa lịch sử, nhu cầu xã hội và định hướng pháp lý.",
        "keywords": [
            "phân vùng cảnh quan đô thị",
            "khu ở",
            "khu thương mại dịch vụ",
            "khu hành chính công cộng",
            "khu công nghiệp kho tàng",
            "khu cây xanh công viên thể thao",
            "khu mặt nước",
            "khu bảo tồn di sản",
            "cơ sở hình thành quy hoạch"
        ],
        "outline": [
            {
                "id": "p1",
                "order": 1,
                "heading": "8 phân vùng cảnh quan đô thị chủ yếu",
                "details": [
                    "Khu ở (dân cư): không gian sinh sống, gắn với sân vườn, cây xanh khu ở.",
                    "Khu thương mại – dịch vụ: mua sắm, dịch vụ và các hoạt động kinh tế.",
                    "Khu hành chính – công cộng – văn hóa – giáo dục: gắn với quảng trường, công trình công cộng.",
                    "Khu công nghiệp – kho tàng: bố trí cách ly, có cây xanh cách ly.",
                    "Khu cây xanh – công viên – thể thao: công viên, vườn hoa, quảng trường, tuyến phố cây xanh.",
                    "Khu mặt nước và hành lang sông hồ: điều hòa khí hậu, thoát nước, tạo cảnh.",
                    "Khu bảo tồn di sản, di tích lịch sử.",
                    "Hệ thống giao thông và hạ tầng kỹ thuật liên kết các khu."
                ],
                "keywords": [
                    "khu ở",
                    "thương mại dịch vụ",
                    "hành chính công cộng",
                    "công nghiệp kho tàng",
                    "cây xanh công viên",
                    "mặt nước sông hồ",
                    "bảo tồn di sản",
                    "hạ tầng giao thông"
                ],
                "content": "Khu ở (dân cư): không gian sinh sống, gắn với sân vườn, cây xanh khu ở.\nKhu thương mại – dịch vụ: mua sắm, dịch vụ và các hoạt động kinh tế.\nKhu hành chính – công cộng – văn hóa – giáo dục: gắn với quảng trường, công trình công cộng.\nKhu công nghiệp – kho tàng: bố trí cách ly, có cây xanh cách ly.\nKhu cây xanh – công viên – thể thao: công viên, vườn hoa, quảng trường, tuyến phố cây xanh.\nKhu mặt nước và hành lang sông hồ: điều hòa khí hậu, thoát nước, tạo cảnh.\nKhu bảo tồn di sản, di tích lịch sử.\nHệ thống giao thông và hạ tầng kỹ thuật liên kết các khu."
            },
            {
                "id": "p2",
                "order": 2,
                "heading": "5 cơ sở hình thành quy hoạch cảnh quan đô thị",
                "details": [
                    "Điều kiện tự nhiên: địa hình, khí hậu, thủy văn, thảm thực vật.",
                    "Hiện trạng đô thị: sử dụng đất, công trình, hạ tầng, không gian công cộng.",
                    "Văn hóa – lịch sử – bản sắc: di tích, phong tục, phong cách sống.",
                    "Nhu cầu dân cư và xã hội: nhu cầu sử dụng, tiếp cận công bằng, không gian linh hoạt.",
                    "Định hướng và pháp lý: quy hoạch chung, yêu cầu phát triển bền vững, thích ứng biến đổi khí hậu và sự tham gia của cộng đồng."
                ],
                "keywords": [
                    "điều kiện tự nhiên",
                    "hiện trạng đô thị",
                    "văn hóa lịch sử",
                    "nhu cầu dân cư xã hội",
                    "định hướng pháp lý",
                    "phát triển bền vững"
                ],
                "content": "Điều kiện tự nhiên: địa hình, khí hậu, thủy văn, thảm thực vật.\nHiện trạng đô thị: sử dụng đất, công trình, hạ tầng, không gian công cộng.\nVăn hóa – lịch sử – bản sắc: di tích, phong tục, phong cách sống.\nNhu cầu dân cư và xã hội: nhu cầu sử dụng, tiếp cận công bằng, không gian linh hoạt.\nĐịnh hướng và pháp lý: quy hoạch chung, yêu cầu phát triển bền vững, thích ứng biến đổi khí hậu và sự tham gia của cộng đồng."
            }
        ],
        "globalIndex": 20,
        "chapterIndex": 4,
        "coreSummary": "Phân vùng cảnh quan đô thị gồm 8 phân khu chức năng đan xen, được xác lập dựa trên 5 cơ sở khoa học về tự nhiên, hiện trạng, văn hóa lịch sử, nhu cầu xã hội và định hướng pháp lý."
    },
    {
        "id": 21,
        "chapterId": 3,
        "chapterTitle": "Chương 3. Nguyên tắc bố cục, quy hoạch và thiết kế cảnh quan",
        "questionNumber": 5,
        "title": "Không gian vườn – công viên và phân loại chức năng",
        "coreConcept": "Vườn – công viên là không gian xanh mở kết hợp tự nhiên và tiểu cảnh phục vụ nghỉ ngơi, thẩm mỹ và sinh thái, phân thành 6 thể loại theo quy mô và chức năng.",
        "keywords": [
            "vườn – công viên",
            "không gian xanh và mở",
            "điều hòa vi khí hậu",
            "đa dạng sinh học",
            "vườn hoa",
            "công viên khu ở",
            "công viên đô thị",
            "công viên sinh thái rừng",
            "công viên chuyên đề",
            "vườn dạo ven sông hồ"
        ],
        "outline": [
            {
                "id": "p1",
                "order": 1,
                "heading": "Khái niệm và chức năng của vườn – công viên",
                "details": [
                    "Vườn – công viên là không gian xanh và mở được tổ chức, kết hợp thực vật, địa hình, mặt nước, công trình và tiểu cảnh.",
                    "Phục vụ nghỉ ngơi, giải trí, giao lưu và thẩm mỹ.",
                    "Chức năng sinh thái quan trọng: điều hòa vi khí hậu, hỗ trợ đa dạng sinh học, tăng khả năng thấm nước."
                ],
                "keywords": [
                    "không gian xanh và mở",
                    "kết hợp thực vật địa hình mặt nước",
                    "nghỉ ngơi giải trí giao lưu",
                    "điều hòa vi khí hậu",
                    "đa dạng sinh học",
                    "thấm nước"
                ],
                "content": "Vườn – công viên là không gian xanh và mở được tổ chức, kết hợp thực vật, địa hình, mặt nước, công trình và tiểu cảnh.\nPhục vụ nghỉ ngơi, giải trí, giao lưu và thẩm mỹ.\nChức năng sinh thái quan trọng: điều hòa vi khí hậu, hỗ trợ đa dạng sinh học, tăng khả năng thấm nước."
            },
            {
                "id": "p2",
                "order": 2,
                "heading": "6 thể loại vườn – công viên theo chức năng và quy mô",
                "details": [
                    "Vườn hoa: quy mô thường nhỏ hơn, nhấn mạnh trưng bày cây hoa; đặt ở khu ở, nút giao, trước công trình.",
                    "Công viên khu ở, khu vực: phục vụ nhu cầu dạo chơi, nghỉ ngơi hằng ngày của dân cư lân cận.",
                    "Công viên đô thị (cấp thành phố): quy mô lớn, đa chức năng, ví dụ công viên Thống Nhất (Hà Nội).",
                    "Công viên sinh thái, công viên rừng, cấp vùng: quy mô rất lớn, thiên về bảo tồn thiên nhiên và sinh thái.",
                    "Công viên chuyên đề: thiếu nhi, thể thao, văn hóa – lịch sử, thực vật (vườn bách thảo), động vật (thảo cầm viên), giải trí.",
                    "Vườn dạo, công viên ven sông hồ: gắn với mặt nước và tuyến đi bộ."
                ],
                "keywords": [
                    "vườn hoa",
                    "công viên khu ở",
                    "công viên đô thị Thống Nhất",
                    "công viên sinh thái rừng",
                    "công viên chuyên đề",
                    "vườn dạo ven sông hồ"
                ],
                "content": "Vườn hoa: quy mô thường nhỏ hơn, nhấn mạnh trưng bày cây hoa; đặt ở khu ở, nút giao, trước công trình.\nCông viên khu ở, khu vực: phục vụ nhu cầu dạo chơi, nghỉ ngơi hằng ngày của dân cư lân cận.\nCông viên đô thị (cấp thành phố): quy mô lớn, đa chức năng, ví dụ công viên Thống Nhất (Hà Nội).\nCông viên sinh thái, công viên rừng, cấp vùng: quy mô rất lớn, thiên về bảo tồn thiên nhiên và sinh thái.\nCông viên chuyên đề: thiếu nhi, thể thao, văn hóa – lịch sử, thực vật (vườn bách thảo), động vật (thảo cầm viên), giải trí.\nVườn dạo, công viên ven sông hồ: gắn với mặt nước và tuyến đi bộ."
            },
            {
                "id": "p3",
                "order": 3,
                "heading": "Tiêu chí và lưu ý khi phân loại",
                "details": [
                    "Cách phân loại có thể thay đổi theo giáo trình. Khi trả lời nên nêu rõ tiêu chí (quy mô, chức năng, tính chất) và cho ví dụ minh họa thực tế."
                ],
                "keywords": [
                    "tiêu chí phân loại",
                    "quy mô",
                    "chức năng",
                    "tính chất",
                    "ví dụ minh họa"
                ],
                "content": "Cách phân loại có thể thay đổi theo giáo trình. Khi trả lời nên nêu rõ tiêu chí (quy mô, chức năng, tính chất) và cho ví dụ minh họa thực tế."
            }
        ],
        "globalIndex": 21,
        "chapterIndex": 5,
        "coreSummary": "Vườn – công viên là không gian xanh mở kết hợp tự nhiên và tiểu cảnh phục vụ nghỉ ngơi, thẩm mỹ và sinh thái, phân thành 6 thể loại theo quy mô và chức năng."
    },
    {
        "id": 22,
        "chapterId": 3,
        "chapterTitle": "Chương 3. Nguyên tắc bố cục, quy hoạch và thiết kế cảnh quan",
        "questionNumber": 6,
        "title": "Nguyên tắc thiết kế sân – quảng trường",
        "coreConcept": "Thiết kế sân – quảng trường là nghệ thuật tổ chức không gian mở công cộng đa chức năng, bảo đảm tiếp cận an toàn cho người đi bộ, tỷ lệ con người phù hợp và cấu trúc nền – tường – trần hài hòa.",
        "keywords": [
            "sân – quảng trường",
            "không gian công cộng mở",
            "công năng linh hoạt",
            "tiếp cận công bằng và an toàn",
            "tỷ lệ quy mô con người",
            "tổ chức nền – tường – trần",
            "bố cục điểm nhấn",
            "vi khí hậu",
            "bản sắc văn hóa",
            "bền vững dễ duy tu"
        ],
        "outline": [
            {
                "id": "p1",
                "order": 1,
                "heading": "Bản chất không gian sân – quảng trường",
                "details": [
                    "Quảng trường đô thị là không gian công cộng mở phục vụ giao lưu, tổ chức sự kiện và các hoạt động cộng đồng."
                ],
                "keywords": [
                    "quảng trường đô thị",
                    "không gian công cộng mở",
                    "giao lưu",
                    "sự kiện cộng đồng"
                ],
                "content": "Quảng trường đô thị là không gian công cộng mở phục vụ giao lưu, tổ chức sự kiện và các hoạt động cộng đồng."
            },
            {
                "id": "p2",
                "order": 2,
                "heading": "8 nguyên tắc thiết kế và vai trò",
                "details": [
                    "Công năng và linh hoạt: đáp ứng nhiều hoạt động (lễ hội, sự kiện, nghỉ ngơi, giao lưu) và có thể thay đổi cách sử dụng, giúp không gian được dùng thường xuyên, hiệu quả.",
                    "Tiếp cận công bằng và an toàn: mọi người dân dễ tiếp cận, ưu tiên người đi bộ, tách giao thông cơ giới, tạo cảm giác an toàn và hấp dẫn.",
                    "Tỷ lệ và quy mô phù hợp con người: không quá trống trải, không quá chật, tạo cảm giác gần gũi và thoải mái.",
                    "Tổ chức nền – tường – trần: nền (vật liệu lát, cỏ, nước), mặt đứng (công trình, hàng cây, tường), mặt trần (tán cây, giàn che) phối hợp để không gian cân bằng, hài hòa, có tỷ lệ phù hợp.",
                    "Bố cục và điểm nhấn: trục, đài phun nước, tượng đài, cây cổ thụ tạo bản sắc và định hướng cho người dùng.",
                    "Cây xanh, mặt nước và vi khí hậu: tạo bóng mát, giảm nhiệt, tăng khả năng thấm nước, giúp không gian dễ chịu khi sử dụng lâu.",
                    "Bản sắc văn hóa – lịch sử: phát huy đặc trưng địa phương, giúp quảng trường trở thành biểu tượng của cộng đồng.",
                    "Bền vững và dễ duy tu: dùng vật liệu phù hợp, thấm nước, tiết kiệm năng lượng, chiếu sáng an toàn."
                ],
                "keywords": [
                    "công năng linh hoạt",
                    "tiếp cận công bằng an toàn",
                    "tỷ lệ quy mô con người",
                    "nền – tường – trần",
                    "bố cục và điểm nhấn",
                    "vi khí hậu cây xanh",
                    "bản sắc văn hóa",
                    "bền vững dễ duy tu"
                ],
                "content": "Công năng và linh hoạt: đáp ứng nhiều hoạt động (lễ hội, sự kiện, nghỉ ngơi, giao lưu) và có thể thay đổi cách sử dụng, giúp không gian được dùng thường xuyên, hiệu quả.\nTiếp cận công bằng và an toàn: mọi người dân dễ tiếp cận, ưu tiên người đi bộ, tách giao thông cơ giới, tạo cảm giác an toàn và hấp dẫn.\nTỷ lệ và quy mô phù hợp con người: không quá trống trải, không quá chật, tạo cảm giác gần gũi và thoải mái.\nTổ chức nền – tường – trần: nền (vật liệu lát, cỏ, nước), mặt đứng (công trình, hàng cây, tường), mặt trần (tán cây, giàn che) phối hợp để không gian cân bằng, hài hòa, có tỷ lệ phù hợp.\nBố cục và điểm nhấn: trục, đài phun nước, tượng đài, cây cổ thụ tạo bản sắc và định hướng cho người dùng.\nCây xanh, mặt nước và vi khí hậu: tạo bóng mát, giảm nhiệt, tăng khả năng thấm nước, giúp không gian dễ chịu khi sử dụng lâu.\nBản sắc văn hóa – lịch sử: phát huy đặc trưng địa phương, giúp quảng trường trở thành biểu tượng của cộng đồng.\nBền vững và dễ duy tu: dùng vật liệu phù hợp, thấm nước, tiết kiệm năng lượng, chiếu sáng an toàn."
            },
            {
                "id": "p3",
                "order": 3,
                "heading": "Kết quả đạt được",
                "details": [
                    "Một không gian mở hài hòa, thu hút người sử dụng và phù hợp với các hoạt động cộng đồng."
                ],
                "keywords": [
                    "hài hòa",
                    "thu hút người sử dụng",
                    "hoạt động cộng đồng"
                ],
                "content": "Một không gian mở hài hòa, thu hút người sử dụng và phù hợp với các hoạt động cộng đồng."
            }
        ],
        "globalIndex": 22,
        "chapterIndex": 6,
        "coreSummary": "Thiết kế sân – quảng trường là nghệ thuật tổ chức không gian mở công cộng đa chức năng, bảo đảm tiếp cận an toàn cho người đi bộ, tỷ lệ con người phù hợp và cấu trúc nền – tường – trần hài hòa."
    },
    {
        "id": 23,
        "chapterId": 3,
        "chapterTitle": "Chương 3. Nguyên tắc bố cục, quy hoạch và thiết kế cảnh quan",
        "questionNumber": 7,
        "title": "Nguyên tắc bố cục tạo hình trong thiết kế cảnh quan",
        "coreConcept": "Bố cục tạo hình cảnh quan đạt được vẻ đẹp hài hòa nhờ sự phối hợp đồng thời giữa Cân bằng, Nhịp điệu, Tỷ lệ và Tương phản trên nền tảng của sự Thống nhất.",
        "keywords": [
            "bố cục tạo hình",
            "cân bằng đối xứng và bất đối xứng",
            "nhịp điệu",
            "tỷ lệ",
            "tương phản",
            "thống nhất tổng thể",
            "trọng lượng thị giác",
            "thang đo con người"
        ],
        "outline": [
            {
                "id": "p1",
                "order": 1,
                "heading": "Nguyên tắc Cân bằng (Đối xứng & Bất đối xứng)",
                "details": [
                    "Đối xứng: hai bên trục giống nhau, phù hợp khi cần cảm giác trang trọng, ổn định (như Taj Mahal, vườn Pháp).",
                    "Bất đối xứng: phân bố trọng lượng thị giác khác nhau nhưng tương đương, tạo vẻ tự nhiên, linh hoạt (như vườn Nhật, vườn phong cảnh Anh).",
                    "Vai trò: tạo cảm giác ổn định, dễ chịu, không bị lệch về một phía."
                ],
                "keywords": [
                    "cân bằng đối xứng",
                    "cân bằng bất đối xứng",
                    "ổn định dễ chịu",
                    "trọng lượng thị giác"
                ],
                "content": "Đối xứng: hai bên trục giống nhau, phù hợp khi cần cảm giác trang trọng, ổn định (như Taj Mahal, vườn Pháp).\nBất đối xứng: phân bố trọng lượng thị giác khác nhau nhưng tương đương, tạo vẻ tự nhiên, linh hoạt (như vườn Nhật, vườn phong cảnh Anh).\nVai trò: tạo cảm giác ổn định, dễ chịu, không bị lệch về một phía."
            },
            {
                "id": "p2",
                "order": 2,
                "heading": "Nguyên tắc Nhịp điệu",
                "details": [
                    "Lặp lại có quy luật các yếu tố như hàng cây, cột đèn, bậc cấp, ô lát.",
                    "Vai trò: dẫn dắt ánh nhìn và tuyến di chuyển, tạo cảm giác chuyển động, liên tục; có thể nhịp điệu đều hoặc thay đổi để tránh đơn điệu."
                ],
                "keywords": [
                    "nhịp điệu",
                    "lặp lại có quy luật",
                    "dẫn dắt ánh nhìn",
                    "tuyến di chuyển",
                    "liên tục"
                ],
                "content": "Lặp lại có quy luật các yếu tố như hàng cây, cột đèn, bậc cấp, ô lát.\nVai trò: dẫn dắt ánh nhìn và tuyến di chuyển, tạo cảm giác chuyển động, liên tục; có thể nhịp điệu đều hoặc thay đổi để tránh đơn điệu."
            },
            {
                "id": "p3",
                "order": 3,
                "heading": "Nguyên tắc Tỷ lệ",
                "details": [
                    "Kích thước các yếu tố phù hợp với nhau và với con người.",
                    "Vai trò: tạo cảm giác thoải mái, không quá nhỏ bé hay choáng ngợp (cây, ghế, đường dạo, công trình phải cùng thang đo)."
                ],
                "keywords": [
                    "tỷ lệ",
                    "phù hợp con người",
                    "cùng thang đo",
                    "thoải mái"
                ],
                "content": "Kích thước các yếu tố phù hợp với nhau và với con người.\nVai trò: tạo cảm giác thoải mái, không quá nhỏ bé hay choáng ngợp (cây, ghế, đường dạo, công trình phải cùng thang đo)."
            },
            {
                "id": "p4",
                "order": 4,
                "heading": "Nguyên tắc Tương phản",
                "details": [
                    "Làm nổi bật sự khác biệt (hình dáng, kích thước, màu sắc, chất liệu) và tạo điểm nhấn.",
                    "Vai trò: tránh đơn điệu, thu hút ánh nhìn tới đối tượng chính."
                ],
                "keywords": [
                    "tương phản",
                    "khác biệt",
                    "điểm nhấn",
                    "tránh đơn điệu",
                    "thu hút ánh nhìn"
                ],
                "content": "Làm nổi bật sự khác biệt (hình dáng, kích thước, màu sắc, chất liệu) và tạo điểm nhấn.\nVai trò: tránh đơn điệu, thu hút ánh nhìn tới đối tượng chính."
            },
            {
                "id": "p5",
                "order": 5,
                "heading": "Nguyên tắc Thống nhất (Nền tảng liên kết)",
                "details": [
                    "Các thành phần có quan hệ hài hòa trong một ý tưởng chung; làm nền tảng kết nối toàn bộ các nguyên tắc trên."
                ],
                "keywords": [
                    "thống nhất",
                    "ý tưởng chung",
                    "nền tảng kết nối"
                ],
                "content": "Các thành phần có quan hệ hài hòa trong một ý tưởng chung; làm nền tảng kết nối toàn bộ các nguyên tắc trên."
            },
            {
                "id": "p6",
                "order": 6,
                "heading": "Tổng hợp phối hợp đồng thời",
                "details": [
                    "Một không gian cảnh quan hài hòa là kết quả của việc phối hợp đồng thời các nguyên tắc này: cân bằng tạo sự ổn định, nhịp điệu tạo chuyển động, tỷ lệ tạo thang đo phù hợp con người, tương phản tạo điểm nhấn, tất cả nằm trong một tổng thể thống nhất."
                ],
                "keywords": [
                    "hài hòa",
                    "phối hợp đồng thời",
                    "tổng thể thống nhất"
                ],
                "content": "Một không gian cảnh quan hài hòa là kết quả của việc phối hợp đồng thời các nguyên tắc này: cân bằng tạo sự ổn định, nhịp điệu tạo chuyển động, tỷ lệ tạo thang đo phù hợp con người, tương phản tạo điểm nhấn, tất cả nằm trong một tổng thể thống nhất."
            }
        ],
        "globalIndex": 23,
        "chapterIndex": 7,
        "coreSummary": "Bố cục tạo hình cảnh quan đạt được vẻ đẹp hài hòa nhờ sự phối hợp đồng thời giữa Cân bằng, Nhịp điệu, Tỷ lệ và Tương phản trên nền tảng của sự Thống nhất."
    }
];

    // Gắn thêm metadata và thuộc tính phụ trợ để tương thích với tất cả các module
    TULUAN_DATA.examId = 'KTCQ';
    TULUAN_DATA.examName = 'Kiến Trúc Cảnh Quan (KTCQ)';
    TULUAN_DATA.totalQuestions = 23;
    TULUAN_DATA.questions = TULUAN_DATA;
    TULUAN_DATA.chapters = [
    {
        "id": 1,
        "title": "Chương 1. Khái niệm cơ bản về cảnh quan và kiến trúc cảnh quan",
        "questionCount": 12,
        "startIndex": 1
    },
    {
        "id": 2,
        "title": "Chương 2. Sự hình thành và phát triển của kiến trúc cảnh quan",
        "questionCount": 4,
        "startIndex": 13
    },
    {
        "id": 3,
        "title": "Chương 3. Nguyên tắc bố cục, quy hoạch và thiết kế cảnh quan",
        "questionCount": 7,
        "startIndex": 17
    }
];

    // Phổ biến ra môi trường trình duyệt (window)
    if (typeof window !== 'undefined') {
        window.TULUAN_DATA = TULUAN_DATA;
    }

    // Hỗ trợ môi trường Node.js / CommonJS cho kiểm thử tự động
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = TULUAN_DATA;
    }
})();
