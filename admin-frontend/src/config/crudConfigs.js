/**
 * Template cấu hình cho Users module
 */
export const usersCrudConfig = {
  baseUrl: '/admin/users',
  defaultForm: {
    username: '',
    email: '',
    fullName: '',
    password: '',
    phoneNumber: '',
    address: '',
    roleName: 'ROLE_USER',
    status: 'ACTIVE'
  },
  transformData: (data) => {
    if (Array.isArray(data)) {
      return data.map(user => ({
        ...user,
        displayName: user.fullName || user.username,
        roleDisplay: (user.roleNames || user.roles || []).join(', ')
      }));
    }
    return {
      ...data,
      displayName: data.fullName || data.username,
      roleDisplay: (data.roleNames || data.roles || []).join(', ')
    };
  },
  transformForm: (form) => {
    // Remove empty password field
    const { password, ...rest } = form;
    if (!password) {
      return rest;
    }
    return form;
  },
  defaultFilters: {
    keyword: ''
  },
  columns: [
    { key: 'id', title: 'ID', width: '80px' },
    { key: 'username', title: 'Username' },
    { key: 'email', title: 'Email' },
    { key: 'displayName', title: 'Họ tên' },
    { key: 'status', title: 'Trạng thái' },
    { key: 'roleDisplay', title: 'Quyền' }
  ],
  searchPlaceholder: 'Tìm theo tên/email/username',
  createButtonText: 'Tạo người dùng',
  createPath: '/admin/users/create',
  editPath: (id) => `/admin/users/edit/${id}`,
  detailPath: (id) => `/admin/users/${id}`,
  deleteConfirmMessage: (item) => `Bạn có chắc chắn muốn xóa người dùng "${item.username}"?`
};

/**
 * Template cấu hình cho Tours module
 */
export const toursCrudConfig = {
  baseUrl: '/admin/tour/api',
  defaultForm: {
    title: '',
    description: '',
    price: 0,
    duration: 1,
    maxParticipants: 10,
    status: 'ACTIVE',
    categoryId: null,
    location: '',
    startDate: '',
    endDate: '',
  },
  transformData: (data) => {
    if (Array.isArray(data)) {
      return data.map(tour => ({
        ...tour,
        priceDisplay: new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(tour.price),
        durationDisplay: `${tour.duration} ngày`,
        dateRange: tour.startDate && tour.endDate 
          ? `${tour.startDate} - ${tour.endDate}`
          : 'Chưa xác định'
      }));
    }
    return {
      ...data,
      priceDisplay: new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(data.price),
      durationDisplay: `${data.duration} ngày`,
      dateRange: data.startDate && data.endDate 
        ? `${data.startDate} - ${data.endDate}`
        : 'Chưa xác định'
    };
  },
  transformForm: (form) => {
    // Convert price to number
    return {
      ...form,
      price: parseFloat(form.price) || 0,
      duration: parseInt(form.duration) || 1,
      maxParticipants: parseInt(form.maxParticipants) || 10
    };
  },
  defaultFilters: {
    keyword: '',
    categoryId: null,
    status: null
  },
  columns: [
    { key: 'id', title: 'ID', width: '80px' },
    { key: 'title', title: 'Tên tour' },
    { key: 'priceDisplay', title: 'Giá' },
    { key: 'durationDisplay', title: 'Thời gian' },
    { key: 'maxParticipants', title: 'Số người' },
    { key: 'status', title: 'Trạng thái' },
    { key: 'dateRange', title: 'Thời gian' }
  ],
  searchPlaceholder: 'Tìm theo tên tour',
  createButtonText: 'Tạo tour',
  createPath: '/admin/tours/create',
  editPath: (id) => `/admin/tours/edit/${id}`,
  detailPath: (id) => `/admin/tours/${id}`,
  deleteConfirmMessage: (item) => `Bạn có chắc chắn muốn xóa tour "${item.title}"?`
};

/**
 * Template cấu hình cho Bookings module
 */
export const bookingsCrudConfig = {
  baseUrl: '/admin/bookings',
  defaultForm: {
    tourId: null,
    userId: null,
    participants: 1,
    totalPrice: 0,
    status: 'PENDING',
    notes: ''
  },
  transformData: (data) => {
    if (Array.isArray(data)) {
      return data.map(booking => ({
        ...booking,
        totalPriceDisplay: new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND'
        }).format(booking.totalPrice),
        bookingDateDisplay: booking.createdAt 
          ? new Date(booking.createdAt).toLocaleDateString('vi-VN')
          : 'N/A',
        statusDisplay: getBookingStatusDisplay(booking.status)
      }));
    }
    return {
      ...data,
      totalPriceDisplay: new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(data.totalPrice),
      bookingDateDisplay: data.createdAt 
        ? new Date(data.createdAt).toLocaleDateString('vi-VN')
        : 'N/A',
      statusDisplay: getBookingStatusDisplay(data.status)
    };
  },
  transformForm: (form) => {
    return {
      ...form,
      participants: parseInt(form.participants) || 1,
      totalPrice: parseFloat(form.totalPrice) || 0
    };
  },
  defaultFilters: {
    keyword: '',
    status: null,
    tourId: null,
    userId: null
  },
  columns: [
    { key: 'id', title: 'ID', width: '80px' },
    { key: 'tourTitle', title: 'Tour' },
    { key: 'userName', title: 'Khách hàng' },
    { key: 'participants', title: 'Số người' },
    { key: 'totalPriceDisplay', title: 'Tổng tiền' },
    { key: 'statusDisplay', title: 'Trạng thái' },
    { key: 'bookingDateDisplay', title: 'Ngày đặt' }
  ],
  searchPlaceholder: 'Tìm theo tên tour hoặc khách hàng',
  createButtonText: 'Tạo booking',
  createPath: '/admin/bookings/create',
  editPath: (id) => `/admin/bookings/edit/${id}`,
  detailPath: (id) => `/admin/bookings/${id}`,
  deleteConfirmMessage: (item) => `Bạn có chắc chắn muốn xóa booking ID: ${item.id}?`
};

/**
 * Helper function để lấy display text cho booking status
 */
function getBookingStatusDisplay(status) {
  const statusMap = {
    PENDING: 'Chờ duyệt',
    CONFIRMED: 'Đã xác nhận',
    CANCELLED: 'Đã hủy',
    COMPLETED: 'Hoàn thành',
    REFUNDED: 'Đã hoàn tiền'
  };
  return statusMap[status] || status;
}

/**
 * Template cấu hình cho Categories module
 */
export const categoriesCrudConfig = {
  baseUrl: '/admin/categories',
  defaultForm: {
    name: '',
    description: '',
    status: 'ACTIVE',
    parentId: null
  },
  transformData: (data) => {
    if (Array.isArray(data)) {
      return data.map(category => ({
        ...category,
        statusDisplay: category.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'
      }));
    }
    return {
      ...data,
      statusDisplay: data.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'
    };
  },
  transformForm: (form) => form,
  defaultFilters: {
    keyword: '',
    status: null
  },
  columns: [
    { key: 'id', title: 'ID', width: '80px' },
    { key: 'name', title: 'Tên danh mục' },
    { key: 'description', title: 'Mô tả' },
    { key: 'statusDisplay', title: 'Trạng thái' }
  ],
  searchPlaceholder: 'Tìm theo tên danh mục',
  createButtonText: 'Tạo danh mục',
  createPath: '/admin/categories/create',
  editPath: (id) => `/admin/categories/edit/${id}`,
  detailPath: (id) => `/admin/categories/${id}`,
  deleteConfirmMessage: (item) => `Bạn có chắc chắn muốn xóa danh mục "${item.name}"?`
};

/**
 * Template cấu hình cho Articles module
 */
export const articlesCrudConfig = {
  baseUrl: '/admin/articles',
  defaultForm: {
    title: '',
    content: '',
    summary: ''
  },
  transformData: (data) => {
    if (Array.isArray(data)) {
      return data.map(article => ({
        ...article,
        statusDisplay: getArticleStatusDisplay(article.status),
        createdDateDisplay: article.createdAt 
          ? new Date(article.createdAt).toLocaleDateString('vi-VN')
          : 'N/A',
        summaryDisplay: article.summary || article.content?.substring(0, 100) + '...'
      }));
    }
    return {
      ...data,
      statusDisplay: getArticleStatusDisplay(data.status),
      createdDateDisplay: data.createdAt 
        ? new Date(data.createdAt).toLocaleDateString('vi-VN')
        : 'N/A',
      summaryDisplay: data.summary || data.content?.substring(0, 100) + '...'
    };
  },
  transformForm: (form) => {
    return {
      title: form.title,
      content: form.content,
      summary: form.summary
    };
  },
  defaultFilters: {
    keyword: '',
    status: null,
    categoryId: null
  },
  columns: [
    { key: 'id', title: 'ID', width: '80px' },
    { key: 'title', title: 'Tiêu đề' },
    { key: 'summaryDisplay', title: 'Tóm tắt' },
    { key: 'statusDisplay', title: 'Trạng thái' },
    { key: 'createdDateDisplay', title: 'Ngày tạo' }
  ],
  searchPlaceholder: 'Tìm theo tiêu đề bài viết',
  createButtonText: 'Tạo bài viết',
  createPath: '/admin/articles/create',
  editPath: (id) => `/admin/articles/edit/${id}`,
  detailPath: (id) => `/admin/articles/${id}`,
  deleteConfirmMessage: (item) => `Bạn có chắc chắn muốn xóa bài viết "${item.title}"?`
};

/**
 * Helper function để lấy display text cho article status
 */
function getArticleStatusDisplay(status) {
  const statusMap = {
    DRAFT: 'Bản nháp',
    PUBLISHED: 'Đã xuất bản',
    ARCHIVED: 'Đã lưu trữ'
  };
  return statusMap[status] || status;
}

/**
 * Template cấu hình cho Support module
 */
export const supportCrudConfig = {
  baseUrl: '/admin/support',
  defaultForm: {
    subject: '',
    description: '',
    category: '',
    priority: 'MEDIUM',
    status: 'OPEN',
    userId: null,
    response: ''
  },
  transformData: (data) => {
    if (Array.isArray(data)) {
      return data.map(support => ({
        ...support,
        statusDisplay: getSupportStatusDisplay(support.status),
        priorityDisplay: getSupportPriorityDisplay(support.priority),
        createdDateDisplay: support.createdAt 
          ? new Date(support.createdAt).toLocaleDateString('vi-VN')
          : 'N/A',
        categoryDisplay: getSupportCategoryDisplay(support.category)
      }));
    }
    return {
      ...data,
      statusDisplay: getSupportStatusDisplay(data.status),
      priorityDisplay: getSupportPriorityDisplay(data.priority),
      createdDateDisplay: data.createdAt 
        ? new Date(data.createdAt).toLocaleDateString('vi-VN')
        : 'N/A',
      categoryDisplay: getSupportCategoryDisplay(data.category)
    };
  },
  transformForm: (form) => form,
  defaultFilters: {
    keyword: '',
    status: null,
    category: null,
    priority: null
  },
  columns: [
    { key: 'id', title: 'ID', width: '80px' },
    { key: 'subject', title: 'Tiêu đề' },
    { key: 'categoryDisplay', title: 'Danh mục' },
    { key: 'priorityDisplay', title: 'Độ ưu tiên' },
    { key: 'statusDisplay', title: 'Trạng thái' },
    { key: 'userName', title: 'Khách hàng' },
    { key: 'createdDateDisplay', title: 'Ngày tạo' }
  ],
  searchPlaceholder: 'Tìm theo tiêu đề hoặc mô tả',
  createButtonText: 'Tạo ticket hỗ trợ',
  createPath: '/admin/support/create',
  editPath: (id) => `/admin/support/edit/${id}`,
  detailPath: (id) => `/admin/support/${id}`,
  deleteConfirmMessage: (item) => `Bạn có chắc chắn muốn xóa ticket "${item.subject}"?`
};

/**
 * Template cấu hình cho Reviews module
 */
export const reviewsCrudConfig = {
  baseUrl: '/admin/reviews',
  defaultForm: {
    tourId: null,
    userId: null,
    rating: 5,
    title: '',
    comment: '',
    status: 'PENDING'
  },
  transformData: (data) => {
    if (Array.isArray(data)) {
      return data.map(review => ({
        ...review,
        statusDisplay: getReviewStatusDisplay(review.status),
        createdDateDisplay: review.createdAt 
          ? new Date(review.createdAt).toLocaleDateString('vi-VN')
          : 'N/A',
        ratingDisplay: `${review.rating}/5 sao`
      }));
    }
    return {
      ...data,
      statusDisplay: getReviewStatusDisplay(data.status),
      createdDateDisplay: data.createdAt 
        ? new Date(data.createdAt).toLocaleDateString('vi-VN')
        : 'N/A',
      ratingDisplay: `${data.rating}/5 sao`
    };
  },
  transformForm: (form) => ({
    ...form,
    rating: parseInt(form.rating) || 5
  }),
  defaultFilters: {
    keyword: '',
    status: null,
    rating: null,
    tourId: null
  },
  columns: [
    { key: 'id', title: 'ID', width: '80px' },
    { key: 'tourTitle', title: 'Tour' },
    { key: 'userName', title: 'Khách hàng' },
    { key: 'ratingDisplay', title: 'Đánh giá' },
    { key: 'title', title: 'Tiêu đề' },
    { key: 'statusDisplay', title: 'Trạng thái' },
    { key: 'createdDateDisplay', title: 'Ngày đánh giá' }
  ],
  searchPlaceholder: 'Tìm theo tiêu đề hoặc nội dung đánh giá',
  createButtonText: 'Tạo đánh giá',
  createPath: '/admin/reviews/create',
  editPath: (id) => `/admin/reviews/edit/${id}`,
  detailPath: (id) => `/admin/reviews/${id}`,
  deleteConfirmMessage: (item) => `Bạn có chắc chắn muốn xóa đánh giá "${item.title}"?`
};

/**
 * Template cấu hình cho Schedule module
 */
export const scheduleCrudConfig = {
  baseUrl: '/admin/schedule',
  defaultForm: {
    tourId: null,
    title: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    status: 'SCHEDULED'
  },
  transformData: (data) => {
    if (Array.isArray(data)) {
      return data.map(schedule => ({
        ...schedule,
        statusDisplay: getScheduleStatusDisplay(schedule.status),
        dateTimeDisplay: schedule.startDate && schedule.endDate 
          ? `${schedule.startDate} - ${schedule.endDate}`
          : 'Chưa xác định',
        timeDisplay: schedule.startTime && schedule.endTime 
          ? `${schedule.startTime} - ${schedule.endTime}`
          : 'Chưa xác định'
      }));
    }
    return {
      ...data,
      statusDisplay: getScheduleStatusDisplay(data.status),
      dateTimeDisplay: data.startDate && data.endDate 
        ? `${data.startDate} - ${data.endDate}`
        : 'Chưa xác định',
      timeDisplay: data.startTime && data.endTime 
        ? `${data.startTime} - ${data.endTime}`
        : 'Chưa xác định'
    };
  },
  transformForm: (form) => form,
  defaultFilters: {
    keyword: '',
    status: null,
    tourId: null,
    startDate: null,
    endDate: null
  },
  columns: [
    { key: 'id', title: 'ID', width: '80px' },
    { key: 'tourTitle', title: 'Tour' },
    { key: 'title', title: 'Tiêu đề' },
    { key: 'location', title: 'Địa điểm' },
    { key: 'dateTimeDisplay', title: 'Ngày' },
    { key: 'timeDisplay', title: 'Thời gian' },
    { key: 'statusDisplay', title: 'Trạng thái' }
  ],
  searchPlaceholder: 'Tìm theo tiêu đề hoặc địa điểm',
  createButtonText: 'Tạo lịch trình',
  createPath: '/admin/schedule/create',
  editPath: (id) => `/admin/schedule/edit/${id}`,
  detailPath: (id) => `/admin/schedule/${id}`,
  deleteConfirmMessage: (item) => `Bạn có chắc chắn muốn xóa lịch trình "${item.title}"?`
};

/**
 * Helper functions để lấy display text cho các status
 */
function getSupportStatusDisplay(status) {
  const statusMap = {
    OPEN: 'Mở',
    IN_PROGRESS: 'Đang xử lý',
    RESOLVED: 'Đã giải quyết',
    CLOSED: 'Đã đóng'
  };
  return statusMap[status] || status;
}

function getSupportPriorityDisplay(priority) {
  const priorityMap = {
    LOW: 'Thấp',
    MEDIUM: 'Trung bình',
    HIGH: 'Cao',
    URGENT: 'Khẩn cấp'
  };
  return priorityMap[priority] || priority;
}

function getSupportCategoryDisplay(category) {
  const categoryMap = {
    TECHNICAL: 'Kỹ thuật',
    BOOKING: 'Đặt tour',
    PAYMENT: 'Thanh toán',
    GENERAL: 'Chung'
  };
  return categoryMap[category] || category;
}

function getReviewStatusDisplay(status) {
  const statusMap = {
    PENDING: 'Chờ duyệt',
    APPROVED: 'Đã duyệt',
    REJECTED: 'Từ chối'
  };
  return statusMap[status] || status;
}

function getScheduleStatusDisplay(status) {
  const statusMap = {
    SCHEDULED: 'Đã lên lịch',
    IN_PROGRESS: 'Đang diễn ra',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy'
  };
  return statusMap[status] || status;
}

/**
 * Template cấu hình cho Promotions module
 */
export const promotionsCrudConfig = {
  baseUrl: '/admin/promotions/api',
  defaultForm: {
    code: '',
    title: '',
    description: '',
    discountType: 'PERCENTAGE', // PERCENTAGE, FIXED_AMOUNT
    discountValue: 0,
    minOrderAmount: 0,
    maxDiscountAmount: null,
    usageLimit: null,
    usedCount: 0,
    startDate: '',
    endDate: '',
    status: 'ACTIVE',
    applicableTours: []
  },
  transformData: (data) => {
    if (Array.isArray(data)) {
      return data.map(promotion => ({
        ...promotion,
        discountDisplay: promotion.discountType === 'PERCENTAGE' 
          ? `${promotion.discountValue}%`
          : new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(promotion.discountValue),
        statusDisplay: getPromotionStatusDisplay(promotion.status, promotion.startDate, promotion.endDate),
        usageDisplay: promotion.usageLimit 
          ? `${promotion.usedCount}/${promotion.usageLimit}`
          : `${promotion.usedCount}/∞`,
        dateRange: promotion.startDate && promotion.endDate 
          ? `${promotion.startDate} - ${promotion.endDate}`
          : 'Không giới hạn',
        minOrderDisplay: promotion.minOrderAmount > 0 
          ? new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(promotion.minOrderAmount)
          : 'Không giới hạn'
      }));
    }
    return {
      ...data,
      discountDisplay: data.discountType === 'PERCENTAGE' 
        ? `${data.discountValue}%`
        : new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(data.discountValue),
      statusDisplay: getPromotionStatusDisplay(data.status, data.startDate, data.endDate),
      usageDisplay: data.usageLimit 
        ? `${data.usedCount}/${data.usageLimit}`
        : `${data.usedCount}/∞`,
      dateRange: data.startDate && data.endDate 
        ? `${data.startDate} - ${data.endDate}`
        : 'Không giới hạn',
      minOrderDisplay: data.minOrderAmount > 0 
        ? new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(data.minOrderAmount)
        : 'Không giới hạn'
    };
  },
  transformForm: (form) => {
    return {
      ...form,
      discountValue: parseFloat(form.discountValue) || 0,
      minOrderAmount: parseFloat(form.minOrderAmount) || 0,
      maxDiscountAmount: form.maxDiscountAmount ? parseFloat(form.maxDiscountAmount) : null,
      usageLimit: form.usageLimit ? parseInt(form.usageLimit) : null,
      usedCount: parseInt(form.usedCount) || 0
    };
  },
  defaultFilters: {
    keyword: '',
    status: null,
    discountType: null,
    startDate: null,
    endDate: null
  },
  columns: [
    { key: 'id', title: 'ID', width: '80px' },
    { key: 'code', title: 'Mã giảm giá' },
    { key: 'title', title: 'Tiêu đề' },
    { key: 'discountDisplay', title: 'Giảm giá' },
    { key: 'minOrderDisplay', title: 'Đơn tối thiểu' },
    { key: 'usageDisplay', title: 'Sử dụng' },
    { key: 'statusDisplay', title: 'Trạng thái' },
    { key: 'dateRange', title: 'Thời gian' }
  ],
  searchPlaceholder: 'Tìm theo mã giảm giá hoặc tiêu đề',
  createButtonText: 'Tạo mã giảm giá',
  createPath: '/admin/promotions/create',
  editPath: (id) => `/admin/promotions/edit/${id}`,
  detailPath: (id) => `/admin/promotions/${id}`,
  deleteConfirmMessage: (item) => `Bạn có chắc chắn muốn xóa mã giảm giá "${item.code}"?`
};

/**
 * Helper function để lấy display text cho promotion status
 */
function getPromotionStatusDisplay(status, startDate, endDate) {
  const now = new Date();
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  
  if (status === 'INACTIVE') {
    return 'Không hoạt động';
  }
  
  if (start && now < start) {
    return 'Chưa bắt đầu';
  }
  
  if (end && now > end) {
    return 'Đã hết hạn';
  }
  
  return 'Đang hoạt động';
}

/**
 * Function để tạo CRUD config từ template
 * @param {Object} template - Template config
 * @param {Object} overrides - Override values
 * @returns {Object} - Final CRUD config
 */
export function createCrudConfig(template, overrides = {}) {
  return {
    ...template,
    ...overrides,
    columns: overrides.columns || template.columns,
    defaultForm: { ...template.defaultForm, ...overrides.defaultForm },
    defaultFilters: { ...template.defaultFilters, ...overrides.defaultFilters }
  };
}
