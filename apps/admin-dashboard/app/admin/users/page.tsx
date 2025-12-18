"use client";



import React, { useState, useMemo, useCallback } from "react";


interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive";
  joinDate: string;
  address?: string;
  city?: string;
  state?: string;
  dateOfBirth?: string;
  gender?: "Male" | "Female" | "Other";
  totalConsultations?: number;
  totalSpent?: number;
  lastActive?: string;
  avatar?: string;
}


/**
 * Number of users to display per page
 * @constant {number}
 */
const ITEMS_PER_PAGE = 10;


const ALL_USERS: User[] = [
  { 
    id: 1, 
    name: "Rahul Sharma", 
    email: "rahul@example.com", 
    phone: "+91 98765 43210", 
    status: "Active", 
    joinDate: "2024-01-15",
    address: "123 MG Road",
    city: "Mumbai",
    state: "Maharashtra",
    dateOfBirth: "1990-05-15",
    gender: "Male",
    totalConsultations: 12,
    totalSpent: 5400,
    lastActive: "2 hours ago",
    avatar: "https://i.pravatar.cc/150?img=12"
  },
  { 
    id: 2, 
    name: "Priya Singh", 
    email: "priya@example.com", 
    phone: "+91 98765 43211", 
    status: "Active", 
    joinDate: "2024-01-14",
    address: "456 Park Street",
    city: "Kolkata",
    state: "West Bengal",
    dateOfBirth: "1992-08-20",
    gender: "Female",
    totalConsultations: 8,
    totalSpent: 3200,
    lastActive: "1 day ago",
    avatar: "https://i.pravatar.cc/150?img=5"
  },
  { 
    id: 3, 
    name: "Amit Kumar", 
    email: "amit@example.com", 
    phone: "+91 98765 43212", 
    status: "Inactive", 
    joinDate: "2024-01-13",
    address: "789 Nehru Place",
    city: "Delhi",
    state: "Delhi",
    dateOfBirth: "1988-03-10",
    gender: "Male",
    totalConsultations: 3,
    totalSpent: 1500,
    lastActive: "2 weeks ago",
    avatar: "https://i.pravatar.cc/150?img=33"
  },
  { id: 4, name: "Sneha Patel", email: "sneha@example.com", phone: "+91 98765 43213", status: "Active", joinDate: "2024-01-12", address: "321 Ring Road", city: "Ahmedabad", state: "Gujarat", dateOfBirth: "1995-12-05", gender: "Female", totalConsultations: 15, totalSpent: 7500, lastActive: "5 hours ago", avatar: "https://i.pravatar.cc/150?img=9" },
  { id: 5, name: "Vikram Singh", email: "vikram@example.com", phone: "+91 98765 43214", status: "Active", joinDate: "2024-01-11", address: "654 Mall Road", city: "Jaipur", state: "Rajasthan", dateOfBirth: "1987-07-22", gender: "Male", totalConsultations: 20, totalSpent: 10000, lastActive: "3 hours ago", avatar: "https://i.pravatar.cc/150?img=15" },
  { id: 6, name: "Anjali Verma", email: "anjali@example.com", phone: "+91 98765 43215", status: "Inactive", joinDate: "2024-01-10", address: "987 Station Road", city: "Pune", state: "Maharashtra", dateOfBirth: "1993-11-18", gender: "Female", totalConsultations: 5, totalSpent: 2000, lastActive: "1 month ago", avatar: "https://i.pravatar.cc/150?img=20" },
  { id: 7, name: "Rajesh Gupta", email: "rajesh@example.com", phone: "+91 98765 43216", status: "Active", joinDate: "2024-01-09", address: "147 Gandhi Road", city: "Chennai", state: "Tamil Nadu", dateOfBirth: "1985-04-30", gender: "Male", totalConsultations: 18, totalSpent: 9000, lastActive: "1 hour ago", avatar: "https://i.pravatar.cc/150?img=51" },
  { id: 8, name: "Pooja Mehta", email: "pooja@example.com", phone: "+91 98765 43217", status: "Active", joinDate: "2024-01-08", address: "258 Lake View", city: "Bangalore", state: "Karnataka", dateOfBirth: "1991-09-14", gender: "Female", totalConsultations: 10, totalSpent: 4500, lastActive: "6 hours ago", avatar: "https://i.pravatar.cc/150?img=25" },
  { id: 9, name: "Karan Malhotra", email: "karan@example.com", phone: "+91 98765 43218", status: "Active", joinDate: "2024-01-07", address: "369 Beach Road", city: "Goa", state: "Goa", dateOfBirth: "1994-02-28", gender: "Male", totalConsultations: 7, totalSpent: 3500, lastActive: "4 hours ago", avatar: "https://i.pravatar.cc/150?img=68" },
  { id: 10, name: "Neha Kapoor", email: "neha@example.com", phone: "+91 98765 43219", status: "Inactive", joinDate: "2024-01-06", address: "741 Hill Station", city: "Shimla", state: "Himachal Pradesh", dateOfBirth: "1996-06-12", gender: "Female", totalConsultations: 2, totalSpent: 800, lastActive: "3 weeks ago", avatar: "https://i.pravatar.cc/150?img=32" },
  { id: 11, name: "Arjun Reddy", email: "arjun@example.com", phone: "+91 98765 43220", status: "Active", joinDate: "2024-01-05", city: "Hyderabad", state: "Telangana", totalConsultations: 14, totalSpent: 6800, lastActive: "7 hours ago", avatar: "https://i.pravatar.cc/150?img=13" },
  { id: 12, name: "Divya Sharma", email: "divya@example.com", phone: "+91 98765 43221", status: "Active", joinDate: "2024-01-04", city: "Lucknow", state: "Uttar Pradesh", totalConsultations: 11, totalSpent: 5200, lastActive: "2 hours ago", avatar: "https://i.pravatar.cc/150?img=47" },
  { id: 13, name: "Rohit Joshi", email: "rohit@example.com", phone: "+91 98765 43222", status: "Active", joinDate: "2024-01-03", city: "Indore", state: "Madhya Pradesh", totalConsultations: 9, totalSpent: 4000, lastActive: "5 hours ago", avatar: "https://i.pravatar.cc/150?img=56" },
  { id: 14, name: "Kavita Rao", email: "kavita@example.com", phone: "+91 98765 43223", status: "Inactive", joinDate: "2024-01-02", city: "Bhopal", state: "Madhya Pradesh", totalConsultations: 4, totalSpent: 1800, lastActive: "2 weeks ago", avatar: "https://i.pravatar.cc/150?img=44" },
  { id: 15, name: "Sanjay Kumar", email: "sanjay@example.com", phone: "+91 98765 43224", status: "Active", joinDate: "2024-01-01", city: "Patna", state: "Bihar", totalConsultations: 6, totalSpent: 2700, lastActive: "8 hours ago", avatar: "https://i.pravatar.cc/150?img=59" },
  { id: 16, name: "Riya Desai", email: "riya@example.com", phone: "+91 98765 43225", status: "Active", joinDate: "2023-12-31", city: "Surat", state: "Gujarat", totalConsultations: 13, totalSpent: 6200, lastActive: "3 hours ago", avatar: "https://i.pravatar.cc/150?img=38" },
  { id: 17, name: "Anil Agarwal", email: "anil@example.com", phone: "+91 98765 43226", status: "Active", joinDate: "2023-12-30", city: "Jaipur", state: "Rajasthan", totalConsultations: 17, totalSpent: 8500, lastActive: "1 hour ago", avatar: "https://i.pravatar.cc/150?img=60" },
  { id: 18, name: "Manisha Kulkarni", email: "manisha@example.com", phone: "+91 98765 43227", status: "Inactive", joinDate: "2023-12-29", city: "Nagpur", state: "Maharashtra", totalConsultations: 3, totalSpent: 1200, lastActive: "1 month ago", avatar: "https://i.pravatar.cc/150?img=29" },
  { id: 19, name: "Deepak Chauhan", email: "deepak@example.com", phone: "+91 98765 43228", status: "Active", joinDate: "2023-12-28", city: "Chandigarh", state: "Punjab", totalConsultations: 16, totalSpent: 7800, lastActive: "4 hours ago", avatar: "https://i.pravatar.cc/150?img=70" },
  { id: 20, name: "Simran Kaur", email: "simran@example.com", phone: "+91 98765 43229", status: "Active", joinDate: "2023-12-27", city: "Amritsar", state: "Punjab", totalConsultations: 19, totalSpent: 9500, lastActive: "2 hours ago", avatar: "https://i.pravatar.cc/150?img=41" },
  { id: 21, name: "Varun Nair", email: "varun@example.com", phone: "+91 98765 43230", status: "Active", joinDate: "2023-12-26", city: "Kochi", state: "Kerala", totalConsultations: 12, totalSpent: 5600, lastActive: "6 hours ago", avatar: "https://i.pravatar.cc/150?img=14" },
  { id: 22, name: "Tanvi Shah", email: "tanvi@example.com", phone: "+91 98765 43231", status: "Inactive", joinDate: "2023-12-25", city: "Vadodara", state: "Gujarat", totalConsultations: 2, totalSpent: 900, lastActive: "3 weeks ago", avatar: "https://i.pravatar.cc/150?img=31" },
  { id: 23, name: "Gaurav Bansal", email: "gaurav@example.com", phone: "+91 98765 43232", status: "Active", joinDate: "2023-12-24", city: "Faridabad", state: "Haryana", totalConsultations: 15, totalSpent: 7200, lastActive: "5 hours ago", avatar: "https://i.pravatar.cc/150?img=52" },
  { id: 24, name: "Ishita Chopra", email: "ishita@example.com", phone: "+91 98765 43233", status: "Active", joinDate: "2023-12-23", city: "Gurgaon", state: "Haryana", totalConsultations: 11, totalSpent: 5100, lastActive: "3 hours ago", avatar: "https://i.pravatar.cc/150?img=24" },
  { id: 25, name: "Nikhil Saxena", email: "nikhil@example.com", phone: "+91 98765 43234", status: "Active", joinDate: "2023-12-22", city: "Noida", state: "Uttar Pradesh", totalConsultations: 14, totalSpent: 6700, lastActive: "7 hours ago", avatar: "https://i.pravatar.cc/150?img=57" },
  { id: 26, name: "Preeti Jain", email: "preeti@example.com", phone: "+91 98765 43235", status: "Active", joinDate: "2023-12-21", city: "Raipur", state: "Chhattisgarh", totalConsultations: 8, totalSpent: 3800, lastActive: "4 hours ago", avatar: "https://i.pravatar.cc/150?img=45" },
  { id: 27, name: "Akash Pandey", email: "akash@example.com", phone: "+91 98765 43236", status: "Inactive", joinDate: "2023-12-20", city: "Ranchi", state: "Jharkhand", totalConsultations: 1, totalSpent: 500, lastActive: "1 month ago", avatar: "https://i.pravatar.cc/150?img=66" },
  { id: 28, name: "Shruti Iyer", email: "shruti@example.com", phone: "+91 98765 43237", status: "Active", joinDate: "2023-12-19", city: "Thiruvananthapuram", state: "Kerala", totalConsultations: 13, totalSpent: 6300, lastActive: "2 hours ago", avatar: "https://i.pravatar.cc/150?img=27" },
  { id: 29, name: "Vishal Soni", email: "vishal@example.com", phone: "+91 98765 43238", status: "Active", joinDate: "2023-12-18", city: "Udaipur", state: "Rajasthan", totalConsultations: 10, totalSpent: 4800, lastActive: "5 hours ago", avatar: "https://i.pravatar.cc/150?img=61" },
  { id: 30, name: "Meera Pillai", email: "meera@example.com", phone: "+91 98765 43239", status: "Active", joinDate: "2023-12-17", city: "Coimbatore", state: "Tamil Nadu", totalConsultations: 9, totalSpent: 4200, lastActive: "6 hours ago", avatar: "https://i.pravatar.cc/150?img=43" },
];


export default function UsersPage() {
 
  /** Current active page number for pagination */
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  /** Search term for filtering users by name or email */
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  /** Currently selected user for profile modal */
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  /** Controls the visibility of the user profile modal */
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  
  const { filteredUsers, activeUsers, inactiveUsers } = useMemo(() => {
    // Filter users by name or email (case-insensitive)
    const filtered = ALL_USERS.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Calculate active users count
    const active = ALL_USERS.filter((u) => u.status === "Active").length;
    
    // Calculate inactive users count
    const inactive = ALL_USERS.filter((u) => u.status === "Inactive").length;
    
    return {
      filteredUsers: filtered,
      activeUsers: active,
      inactiveUsers: inactive,
    };
  }, [searchTerm]); // Only re-run when searchTerm changes

  
  const { totalPages, currentUsers, startIndex, endIndex } = useMemo(() => {
    // Calculate total number of pages
    const total = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    
    // Calculate start index for current page
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    
    // Calculate end index for current page
    const end = start + ITEMS_PER_PAGE;
    
    // Get users for current page
    const users = filteredUsers.slice(start, end);
    
    return {
      totalPages: total,
      currentUsers: users,
      startIndex: start,
      endIndex: end,
    };
  }, [filteredUsers, currentPage]); 

  
  const paginationItems = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

 
  /**
   * Handles page change in pagination
   * @param {number} page - The page number to navigate to
   */
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

 
  const handleViewProfile = useCallback((user: User) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  }, []);

  
  const closeModal = useCallback(() => {
    setShowProfileModal(false);
    setSelectedUser(null);
  }, []);

  
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  }, []);



  const StatCard = ({ title, value, borderColor }: { title: string; value: number; borderColor: string }) => (
    <div className="col-md-4">
      <div className={`card border-start ${borderColor} border-4 shadow-sm`}>
        <div className="card-body">
          <h6 className="text-muted mb-1">{title}</h6>
          <h3 className="mb-0">{value}</h3>
        </div>
      </div>
    </div>
  );

  // ----------------------------------------------------------------------------------------
  // JSX RENDER
  // ----------------------------------------------------------------------------------------
  
  return (
    <div className="users-page">
      {/* PAGE HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Users Management</h2>
       
      </div>

      {/* STATISTICS CARDS */}
      <div className="row g-3 mb-4">
        <StatCard title="Total Users" value={ALL_USERS.length} borderColor="border-primary" />
        <StatCard title="Active Users" value={activeUsers} borderColor="border-success" />
        <StatCard title="Inactive Users" value={inactiveUsers} borderColor="border-secondary" />
      </div>

      {/* SEARCH BAR */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={handleSearchChange}
              aria-label="Search users"
            />
          </div>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-dark">
                <tr>
                  <th scope="col">Profile</th>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Join Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr key={user.id}>
                      {/* Profile Picture */}
                      <td>
                        <img
                          src={user.avatar}
                          alt={`${user.name}'s profile`}
                          className="rounded-circle"
                          width="40"
                          height="40"
                          style={{ objectFit: "cover" }}
                          loading="lazy"
                        />
                      </td>
                      
                      {/* User ID */}
                      <td className="text-muted">#{user.id}</td>
                      
                      {/* Name */}
                      <td>
                        <strong>{user.name}</strong>
                      </td>
                      
                      {/* Email */}
                      <td className="text-muted">{user.email}</td>
                      
                      {/* Phone */}
                      <td className="text-muted">{user.phone}</td>
                      
                      {/* Join Date */}
                      <td>
                        <small className="text-muted">{user.joinDate}</small>
                      </td>
                      
                      {/* Status Badge */}
                      <td>
                        <span
                          className={`badge ${
                            user.status === "Active"
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      
                      {/* Action Buttons */}
                      <td>
                        <div className="btn-group" role="group" aria-label="User actions">
                          {/* Edit Button */}
                          <button 
                            className="btn btn-sm btn-primary" 
                            title="Edit user"
                            aria-label={`Edit ${user.name}`}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          
                          {/* View Profile Button */}
                          <button 
                            className="btn btn-sm btn-info"
                            onClick={() => handleViewProfile(user)}
                            title="View profile"
                            aria-label={`View ${user.name}'s profile`}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          
                          {/* Delete Button */}
                          <button 
                            className="btn btn-sm btn-danger" 
                            title="Delete user"
                            aria-label={`Delete ${user.name}`}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  /* Empty State */
                  <tr>
                    <td colSpan={8} className="text-center py-5">
                      <i className="bi bi-inbox fs-1 text-muted d-block mb-3"></i>
                      <p className="text-muted mb-0">No users found</p>
                      <small className="text-muted">Try adjusting your search criteria</small>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        {filteredUsers.length > 0 && (
          <div className="card-footer bg-white border-top">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              {/* Pagination Info */}
              <div className="text-muted small">
                Showing <strong>{startIndex + 1}</strong> to{" "}
                <strong>{Math.min(endIndex, filteredUsers.length)}</strong> of{" "}
                <strong>{filteredUsers.length}</strong> users
              </div>
              
              {/* Pagination Controls */}
              <nav aria-label="User list pagination">
                <ul className="pagination mb-0">
                  {/* Previous Button */}
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Go to previous page"
                    >
                      <i className="bi bi-chevron-left"></i>
                    </button>
                  </li>

                  {/* Page Numbers */}
                  {paginationItems.map((pageNumber) => {
                    // Show first page, last page, and pages around current page
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 &&
                        pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <li
                          key={pageNumber}
                          className={`page-item ${
                            currentPage === pageNumber ? "active" : ""
                          }`}
                        >
                          <button
                            className={`page-link ${
                              currentPage === pageNumber ? "bg-warning border-warning" : ""
                            }`}
                            onClick={() => handlePageChange(pageNumber)}
                            aria-label={`Go to page ${pageNumber}`}
                            aria-current={currentPage === pageNumber ? "page" : undefined}
                          >
                            {pageNumber}
                          </button>
                        </li>
                      );
                    } 
                    // Show ellipsis for skipped pages
                    else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return (
                        <li key={pageNumber} className="page-item disabled">
                          <span className="page-link">...</span>
                        </li>
                      );
                    }
                    return null;
                  })}

                  {/* Next Button */}
                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Go to next page"
                    >
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* USER PROFILE MODAL */}
      {showProfileModal && selectedUser && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="userProfileModalLabel"
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              {/* Modal Header */}
              <div className="modal-header bg-warning">
                <h5 className="modal-title" id="userProfileModalLabel">
                  <i className="bi bi-person-circle me-2"></i>
                  User Profile
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  aria-label="Close modal"
                ></button>
              </div>
              
              {/* Modal Body */}
              <div className="modal-body">
                <div className="row">
                  {/* Left Column - Avatar & Basic Info */}
                  <div className="col-md-4 text-center border-end">
                    <img
                      src={selectedUser.avatar}
                      alt={`${selectedUser.name}'s profile`}
                      className="rounded-circle mb-3 border border-3 border-warning shadow"
                      width="150"
                      height="150"
                      style={{ objectFit: "cover" }}
                    />
                    <h4 className="mb-1">{selectedUser.name}</h4>
                    <p className="text-muted mb-2">{selectedUser.email}</p>
                    <span
                      className={`badge ${
                        selectedUser.status === "Active"
                          ? "bg-success"
                          : "bg-secondary"
                      } mb-3 px-3 py-2`}
                    >
                      {selectedUser.status}
                    </span>
                    <p className="small text-muted mb-0">
                      <i className="bi bi-clock me-1"></i>
                      Last active: {selectedUser.lastActive}
                    </p>
                  </div>

                  {/* Right Column - Detailed Info */}
                  <div className="col-md-8">
                    {/* Personal Information Section */}
                    <h6 className="border-bottom pb-2 mb-3 text-primary">
                      <i className="bi bi-person-badge me-2"></i>
                      Personal Information
                    </h6>
                    <div className="row mb-2">
                      <div className="col-5 text-muted">
                        <i className="bi bi-telephone me-1"></i>Phone:
                      </div>
                      <div className="col-7"><strong>{selectedUser.phone}</strong></div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-5 text-muted">
                        <i className="bi bi-calendar me-1"></i>Date of Birth:
                      </div>
                      <div className="col-7">{selectedUser.dateOfBirth || "N/A"}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-5 text-muted">
                        <i className="bi bi-gender-ambiguous me-1"></i>Gender:
                      </div>
                      <div className="col-7">{selectedUser.gender || "N/A"}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-5 text-muted">
                        <i className="bi bi-house me-1"></i>Address:
                      </div>
                      <div className="col-7">{selectedUser.address || "N/A"}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-5 text-muted">
                        <i className="bi bi-geo-alt me-1"></i>City:
                      </div>
                      <div className="col-7">{selectedUser.city || "N/A"}</div>
                    </div>
                    <div className="row mb-4">
                      <div className="col-5 text-muted">
                        <i className="bi bi-map me-1"></i>State:
                      </div>
                      <div className="col-7">{selectedUser.state || "N/A"}</div>
                    </div>

                    {/* Account Details Section */}
                    <h6 className="border-bottom pb-2 mb-3 text-primary">
                      <i className="bi bi-info-circle me-2"></i>
                      Account Details
                    </h6>
                    <div className="row mb-2">
                      <div className="col-5 text-muted">
                        <i className="bi bi-hash me-1"></i>User ID:
                      </div>
                      <div className="col-7"><strong>#{selectedUser.id}</strong></div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-5 text-muted">
                        <i className="bi bi-calendar-check me-1"></i>Join Date:
                      </div>
                      <div className="col-7">{selectedUser.joinDate}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-5 text-muted">
                        <i className="bi bi-chat-dots me-1"></i>Total Consultations:
                      </div>
                      <div className="col-7">
                        <span className="badge bg-info">{selectedUser.totalConsultations || 0}</span>
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-5 text-muted">
                        <i className="bi bi-currency-rupee me-1"></i>Total Spent:
                      </div>
                      <div className="col-7">
                        <strong className="text-success fs-5">₹{selectedUser.totalSpent || 0}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  <i className="bi bi-x-circle me-2"></i>Close
                </button>
                <button type="button" className="btn btn-primary">
                  <i className="bi bi-pencil me-2"></i>Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}