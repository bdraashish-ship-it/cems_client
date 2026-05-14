import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Camera,
  Settings,
  ClipboardList,
  Wrench,
  Truck,
  AlertTriangle,
  SlidersHorizontal,
  PersonStanding,
  ComputerIcon,
  Workflow,
  View,
  Building2,
  Plus,
  Tag,
  Layers,
  Briefcase,
  CheckCircle2,
  FileText,
  Search,
} from "lucide-react";
import { NavIconInfo } from "../widgets/NavigationIconInfo";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  useGetAllProjectsQuery,
  useGetAllClientsQuery,
  useGetAllEmployeesQuery
} from "../../services/features/cemsApi";

type MenuKey =
  | "projects"
  | "resources"
  | "site"
  | "finance"
  | "analysis"
  | "settings"
  | null;

export const Navigation = () => {
  const navRef = useRef<HTMLElement | null>(null);
  const [activeMenu, setActiveMenu] = useState<MenuKey>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Sync Active Menu with URL
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/projects")) {
      setActiveMenu("projects");
      if (path.includes("/categories")) setActiveSubMenu("proj-categories");
      else if (path.includes("/create")) setActiveSubMenu("proj-new");
    } else if (path.startsWith("/resources") || path.includes("material")) {
      setActiveMenu("resources");
      if (path.includes("/materials")) setActiveSubMenu("res-materials");
    } else if (path.startsWith("/settings")) {
      setActiveMenu("settings");
      if (path.includes("/users")) setActiveSubMenu("set-users");
      else if (path.includes("/employees")) setActiveSubMenu("set-emp");
      else if (path.includes("/clients")) setActiveSubMenu("set-client");
      else if (path.includes("/designations") || path.includes("/statuses") || path.includes("/document-types")) setActiveSubMenu("set-master");
    } else if (path.startsWith("/site")) {
      setActiveMenu("site");
    } else {
      setActiveMenu(null);
    }
  }, [location.pathname]);

  // Fetch Data for Global Search
  const { data: projectsData } = useGetAllProjectsQuery({});
  const { data: clientsData } = useGetAllClientsQuery({});
  const { data: employeesData } = useGetAllEmployeesQuery({});

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { projects: [], clients: [], employees: [] };
    const q = searchQuery.toLowerCase();

    return {
      projects: (projectsData?.data || []).filter((p: any) =>
        p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)
      ).slice(0, 3),
      clients: (clientsData?.data || []).filter((c: any) =>
        c.name.toLowerCase().includes(q) || c.contact_person?.toLowerCase().includes(q)
      ).slice(0, 3),
      employees: (employeesData?.data || []).filter((e: any) =>
        e.full_name.toLowerCase().includes(q) || e.designation?.toLowerCase().includes(q)
      ).slice(0, 3)
    };
  }, [searchQuery, projectsData, clientsData, employeesData]);

  const hasResults = searchResults.projects.length > 0 || searchResults.clients.length > 0 || searchResults.employees.length > 0;

  const toggleMenu = (menu: MenuKey) => {
    setActiveMenu(prev => (prev === menu ? null : menu));
    setActiveSubMenu(null);
  };

  const toggleSubMenu = (submenu: string) => {
    setActiveSubMenu(prev => (prev === submenu ? null : submenu));
  };

  const closeAllMenus = (e?: React.MouseEvent) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    setActiveMenu(null);
    setActiveSubMenu(null);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        closeAllMenus();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <nav className="nav" ref={navRef}>
      {/* Logo */}
      <div className="nav__logo">
        CEMS
        <span>Civil Engineering Management System</span>
      </div>

      {/* Global Search Bar */}
      <div className="nav__search-container">
        <div className="nav__search-wrapper">
          <Search size={16} className="nav__search-icon" />
          <input
            type="text"
            placeholder="Search everything..."
            className="nav__search-input"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
          />
          <div className="nav__search-hint">⌘K</div>

          {/* Search Results Overlay */}
          {showResults && searchQuery.trim() && (
            <div className="nav__search-results">
              {!hasResults ? (
                <div className="search-empty">No records found for "{searchQuery}"</div>
              ) : (
                <>
                  {searchResults.projects.length > 0 && (
                    <div className="search-section">
                      <div className="section-title">Projects</div>
                      {searchResults.projects.map((p: any) => (
                        <div key={p.id} className="search-item" onClick={() => { navigate(`/projects?search=${p.name}`); setShowResults(false); setSearchQuery(""); }}>
                          <FolderKanban size={14} />
                          <div className="item-info">
                            <span className="item-name">{p.name}</span>
                            <span className="item-sub">{p.code}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.clients.length > 0 && (
                    <div className="search-section">
                      <div className="section-title">Clients</div>
                      {searchResults.clients.map((c: any) => (
                        <div key={c.id} className="search-item" onClick={() => { navigate(`/settings/clients?search=${c.name}`); setShowResults(false); setSearchQuery(""); }}>
                          <Building2 size={14} />
                          <div className="item-info">
                            <span className="item-name">{c.name}</span>
                            <span className="item-sub">{c.contact_person}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.employees.length > 0 && (
                    <div className="search-section">
                      <div className="section-title">Personnel</div>
                      {searchResults.employees.map((e: any) => (
                        <div key={e.id} className="search-item" onClick={() => { navigate(`/settings/employees?search=${e.full_name}`); setShowResults(false); setSearchQuery(""); }}>
                          <Users size={14} />
                          <div className="item-info">
                            <span className="item-name">{e.full_name}</span>
                            <span className="item-sub">{e.designation}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      <ul className="nav__menu">
        {/* Dashboard */}
        <li className={`nav__item ${activeMenu === null ? "is-active" : ""}`} onClick={closeAllMenus}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => isActive ? "nav__link is-active" : "nav__link"}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>
        </li>

        {/* Projects */}
        <li
          className={`nav__item dropdown ${activeMenu === "projects" ? "is-open is-active" : ""}`}
          onClick={() => toggleMenu("projects")}
        >
          <FolderKanban size={18} />
          Projects
          <ul className="dropdown-menu">
            <li className="dropdown-item">
              <NavLink to="/projects" className="nav__link" onClick={closeAllMenus}>
                <ClipboardList size={16} /> Project Inventory
              </NavLink>
            </li>

            {/* Project Categories */}
            <li className="dropdown-item has-submenu" onClick={(e) => { e.stopPropagation(); toggleSubMenu('proj-categories'); }}>
              <div className="submenu-title"><Tag size={16} /> Categories</div>
              <SlidersHorizontal size={16} className="submenu-toggle-icon" />
            </li>
            <ul className={`sub-dropdown-menu ${activeSubMenu === 'proj-categories' ? "is-open" : ""}`}>
              <li className="dropdown-item">
                <NavLink to="/projects/categories" className="nav__link" onClick={closeAllMenus}>
                  <View size={16} /> View Categories
                </NavLink>
              </li>
              <li className="dropdown-item">
                <NavLink to="/projects/categories/create" className="nav__link" onClick={closeAllMenus}>
                  <Plus size={16} /> Create Category
                </NavLink>
              </li>
            </ul>

            {/* New Project */}
            <li className="dropdown-item has-submenu" onClick={(e) => { e.stopPropagation(); toggleSubMenu('proj-new'); }}>
              <div className="submenu-title"><Layers size={16} /> New Project</div>
              <SlidersHorizontal size={16} className="submenu-toggle-icon" />
            </li>
            <ul className={`sub-dropdown-menu ${activeSubMenu === 'proj-new' ? "is-open" : ""}`}>
              <li className="dropdown-item">
                <NavLink to="/projects/create" className="nav__link" onClick={closeAllMenus}>
                  <Plus size={16} /> Register Project
                </NavLink>
              </li>
            </ul>
          </ul>
        </li>

        {/* Resources */}
        <li
          className={`nav__item dropdown ${activeMenu === "resources" ? "is-open is-active" : ""}`}
          onClick={() => toggleMenu("resources")}
        >
          <Wrench size={18} />
          Resources
          <ul className="dropdown-menu">


            {/* Materials */}
            <li className="dropdown-item has-submenu" onClick={(e) => { e.stopPropagation(); toggleSubMenu('res-materials'); }}>
              <div className="submenu-title"><Wrench size={16} /> Materials</div>
              <SlidersHorizontal size={16} className="submenu-toggle-icon" />
            </li>
            <ul className={`sub-dropdown-menu ${activeSubMenu === 'res-materials' ? "is-open" : ""}`}>
              <li className="dropdown-item">
                <NavLink to="/resources/materials/all" className="nav__link" onClick={closeAllMenus}>
                  <View size={16} /> Warehouse/Stock
                </NavLink>
              </li>
              <li className="dropdown-item">
                <NavLink to="/resources/materials/create" className="nav__link" onClick={closeAllMenus}>
                  <Plus size={16} /> Stock In/Entry
                </NavLink>
              </li>
              <li className="dropdown-item">
                <NavLink to="/resources/assignments" className="nav__link" onClick={closeAllMenus}>
                  <Truck size={16} /> Logistics / Allocation
                </NavLink>
              </li>
            </ul>

            <li className="dropdown-item">
              <NavLink to="/settings/material-categories" className="nav__link" onClick={closeAllMenus}>
                <Layers size={16} /> Classifications
              </NavLink>
            </li>
            {/* Material Units */}
            <li className="dropdown-item">
              <NavLink to="/settings/material-units" className="nav__link" onClick={closeAllMenus}>
                <Tag size={16} /> Measurement Units
              </NavLink>
            </li>
          </ul>
        </li>

        {/* Sites */}
        <li
          className={`nav__item dropdown ${activeMenu === "site" ? "is-open is-active" : ""}`}
          onClick={() => toggleMenu("site")}
        >
          <Building2 size={18} />
          Sites
          <ul className="dropdown-menu">
            <li className="dropdown-item">
              <NavLink to="/settings/site-types" className="nav__link" onClick={closeAllMenus}>
                <Layers size={16} /> Site Types
              </NavLink>
            </li>
            <li className="dropdown-item">
              <NavLink to="/settings/sites" className="nav__link" onClick={closeAllMenus}>
                <Building2 size={16} /> Site Inventory
              </NavLink>
            </li>
          </ul>
        </li>



        {/* System Settings */}
        <li
          className={`nav__item dropdown ${activeMenu === "settings" ? "is-open is-active" : ""}`}
          onClick={() => toggleMenu("settings")}
        >
          <Settings size={18} />
          System Settings
          <ul className="dropdown-menu">
            <li className="dropdown-item">
              <NavLink to="/settings/company" className="nav__link" onClick={closeAllMenus}>
                <Building2 size={16} /> Company Config
              </NavLink>
            </li>

            {/* Access Control */}
            <li className="dropdown-item has-submenu" onClick={(e) => { e.stopPropagation(); toggleSubMenu('set-users'); }}>
              <div className="submenu-title"><ComputerIcon size={16} /> Access Control</div>
              <SlidersHorizontal size={16} className="submenu-toggle-icon" />
            </li>
            <ul className={`sub-dropdown-menu ${activeSubMenu === 'set-users' ? "is-open" : ""}`}>
              <li className="dropdown-item">
                <NavLink to="/settings/users" className="nav__link" onClick={closeAllMenus}>
                  <Users size={16} /> Software Users
                </NavLink>
              </li>
              <li className="dropdown-item">
                <NavLink to="/settings/users/create" className="nav__link" onClick={closeAllMenus}>
                  <PersonStanding size={16} /> Register New User
                </NavLink>
              </li>
              <li className="dropdown-item">
                <NavLink to="/settings/roles" className="nav__link" onClick={closeAllMenus}>
                  <View size={16} /> Permissions/Roles
                </NavLink>
              </li>
            </ul>

            {/* Master Records */}
            <li className="dropdown-item has-submenu" onClick={(e) => { e.stopPropagation(); toggleSubMenu('set-master'); }}>
              <div className="submenu-title"><Workflow size={16} /> Master Records</div>
              <SlidersHorizontal size={16} className="submenu-toggle-icon" />
            </li>
            <ul className={`sub-dropdown-menu ${activeSubMenu === 'set-master' ? "is-open" : ""}`}>

              <li className="dropdown-item">
                <NavLink to="/settings/designations" className="nav__link" onClick={closeAllMenus}>
                  <Briefcase size={16} /> Designations
                </NavLink>
              </li>
              <li className="dropdown-item">
                <NavLink to="/settings/statuses" className="nav__link" onClick={closeAllMenus}>
                  <CheckCircle2 size={16} /> Workflow Statuses
                </NavLink>
              </li>
              <li className="dropdown-item">
                <NavLink to="/settings/document-types" className="nav__link" onClick={closeAllMenus}>
                  <FileText size={16} /> Document Types
                </NavLink>
              </li>
            </ul>

            {/* HRM Setup */}
            <li className="dropdown-item has-submenu" onClick={(e) => { e.stopPropagation(); toggleSubMenu('set-emp'); }}>
              <div className="submenu-title"><Workflow size={16} /> HRM Setup</div>
              <SlidersHorizontal size={16} className="submenu-toggle-icon" />
            </li>
            <ul className={`sub-dropdown-menu ${activeSubMenu === 'set-emp' ? "is-open" : ""}`}>
              <li className="dropdown-item">
                <NavLink to="/settings/employees" className="nav__link" onClick={closeAllMenus}>
                  <Users size={16} /> Employee Directory
                </NavLink>
              </li>
              <li className="dropdown-item">
                <NavLink to="/settings/employees/create" className="nav__link" onClick={closeAllMenus}>
                  <PersonStanding size={16} /> Onboard Employee
                </NavLink>
              </li>
            </ul>

            {/* Client CRM */}
            <li className="dropdown-item has-submenu" onClick={(e) => { e.stopPropagation(); toggleSubMenu('set-client'); }}>
              <div className="submenu-title"><Workflow size={16} /> Client CRM</div>
              <SlidersHorizontal size={16} className="submenu-toggle-icon" />
            </li>
            <ul className={`sub-dropdown-menu ${activeSubMenu === 'set-client' ? "is-open" : ""}`}>
              <li className="dropdown-item">
                <NavLink to="/settings/clients/all" className="nav__link" onClick={closeAllMenus}>
                  <Users size={16} /> Client Portfolio
                </NavLink>
              </li>
              <li className="dropdown-item">
                <NavLink to="/settings/clients/create" className="nav__link" onClick={closeAllMenus}>
                  <PersonStanding size={16} /> Add New Client
                </NavLink>
              </li>
            </ul>
          </ul>
        </li>
      </ul>

      {/* Right Side Icons */}
      <NavIconInfo userName="Aashish" />
    </nav>
  );
};