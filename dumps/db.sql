--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Postgres.app)
-- Dumped by pg_dump version 16.3 (Postgres.app)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DGFA; Type: DATABASE; Schema: -; Owner: UGFA
--

CREATE DATABASE "DGFA" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';


ALTER DATABASE "DGFA" OWNER TO "UGFA";

\connect "DGFA"

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Branch; Type: TABLE; Schema: public; Owner: UGFA
--

CREATE TABLE public."Branch" (
    "branchId" integer NOT NULL,
    name character varying(256) NOT NULL,
    "companyId" integer NOT NULL,
    y0 double precision NOT NULL,
    y1 double precision NOT NULL,
    x0 double precision NOT NULL,
    x1 double precision NOT NULL
);


ALTER TABLE public."Branch" OWNER TO "UGFA";

--
-- Name: Branch_branchId_seq; Type: SEQUENCE; Schema: public; Owner: UGFA
--

CREATE SEQUENCE public."Branch_branchId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Branch_branchId_seq" OWNER TO "UGFA";

--
-- Name: Branch_branchId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: UGFA
--

ALTER SEQUENCE public."Branch_branchId_seq" OWNED BY public."Branch"."branchId";


--
-- Name: Employee; Type: TABLE; Schema: public; Owner: UGFA
--

CREATE TABLE public."Employee" (
    "employeeId" integer NOT NULL,
    username character varying(256) NOT NULL,
    password character varying(256) NOT NULL,
    "branchId" integer NOT NULL,
    "btMac" character varying(17) NOT NULL
);


ALTER TABLE public."Employee" OWNER TO "UGFA";

--
-- Name: BtMacsView; Type: VIEW; Schema: public; Owner: UGFA
--

CREATE VIEW public."BtMacsView" AS
 SELECT "branchId",
    "btMac"
   FROM public."Employee";


ALTER VIEW public."BtMacsView" OWNER TO "UGFA";

--
-- Name: Company; Type: TABLE; Schema: public; Owner: UGFA
--

CREATE TABLE public."Company" (
    "companyId" integer NOT NULL,
    name character varying(256) NOT NULL
);


ALTER TABLE public."Company" OWNER TO "UGFA";

--
-- Name: Company_companyid_seq; Type: SEQUENCE; Schema: public; Owner: UGFA
--

CREATE SEQUENCE public."Company_companyid_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Company_companyid_seq" OWNER TO "UGFA";

--
-- Name: Company_companyid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: UGFA
--

ALTER SEQUENCE public."Company_companyid_seq" OWNED BY public."Company"."companyId";


--
-- Name: Document; Type: TABLE; Schema: public; Owner: UGFA
--

CREATE TABLE public."Document" (
    "documentId" integer NOT NULL,
    "branchId" integer NOT NULL,
    content character varying NOT NULL
);


ALTER TABLE public."Document" OWNER TO "UGFA";

--
-- Name: Document_documentId_seq; Type: SEQUENCE; Schema: public; Owner: UGFA
--

CREATE SEQUENCE public."Document_documentId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Document_documentId_seq" OWNER TO "UGFA";

--
-- Name: Document_documentId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: UGFA
--

ALTER SEQUENCE public."Document_documentId_seq" OWNED BY public."Document"."documentId";


--
-- Name: Employee_employeeId_seq; Type: SEQUENCE; Schema: public; Owner: UGFA
--

CREATE SEQUENCE public."Employee_employeeId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Employee_employeeId_seq" OWNER TO "UGFA";

--
-- Name: Employee_employeeId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: UGFA
--

ALTER SEQUENCE public."Employee_employeeId_seq" OWNED BY public."Employee"."employeeId";


--
-- Name: Branch branchId; Type: DEFAULT; Schema: public; Owner: UGFA
--

ALTER TABLE ONLY public."Branch" ALTER COLUMN "branchId" SET DEFAULT nextval('public."Branch_branchId_seq"'::regclass);


--
-- Name: Company companyId; Type: DEFAULT; Schema: public; Owner: UGFA
--

ALTER TABLE ONLY public."Company" ALTER COLUMN "companyId" SET DEFAULT nextval('public."Company_companyid_seq"'::regclass);


--
-- Name: Document documentId; Type: DEFAULT; Schema: public; Owner: UGFA
--

ALTER TABLE ONLY public."Document" ALTER COLUMN "documentId" SET DEFAULT nextval('public."Document_documentId_seq"'::regclass);


--
-- Name: Employee employeeId; Type: DEFAULT; Schema: public; Owner: UGFA
--

ALTER TABLE ONLY public."Employee" ALTER COLUMN "employeeId" SET DEFAULT nextval('public."Employee_employeeId_seq"'::regclass);


--
-- Data for Name: Branch; Type: TABLE DATA; Schema: public; Owner: UGFA
--

COPY public."Branch" ("branchId", name, "companyId", y0, y1, x0, x1) FROM stdin;
1	Tinaztepe Campus	1	38.376517	38.365742	27.191847	27.21205
2	Area 51	2	37.282188	37.212334	-115.824466	-115.777152
\.


--
-- Data for Name: Company; Type: TABLE DATA; Schema: public; Owner: UGFA
--

COPY public."Company" ("companyId", name) FROM stdin;
1	Dokuz Eylul University
2	United States Air Force
\.


--
-- Data for Name: Document; Type: TABLE DATA; Schema: public; Owner: UGFA
--

COPY public."Document" ("documentId", "branchId", content) FROM stdin;
1	1	Shhh... let's not leak our hard work!\nThis is a confidential information, sharing may result in legal consequences!\nWe'll be launching Project Titan on July the 2nd, please start preparations.
\.


--
-- Data for Name: Employee; Type: TABLE DATA; Schema: public; Owner: UGFA
--

COPY public."Employee" ("employeeId", username, password, "branchId", "btMac") FROM stdin;
1	tinaztepeLecturer	1231230Aa.	1	BC:A5:8B:3E:E5:A0
2	tinaztepeEmployee	1231230Aa.	1	DC:21:48:E6:74:0D
4	area51Alien	1231230Aa.	2	BC:A5:8B:3E:E5:A0
6	area51Employee	1231230Aa.	2	DC:21:48:E6:74:0D
\.


--
-- Name: Branch_branchId_seq; Type: SEQUENCE SET; Schema: public; Owner: UGFA
--

SELECT pg_catalog.setval('public."Branch_branchId_seq"', 2, true);


--
-- Name: Company_companyid_seq; Type: SEQUENCE SET; Schema: public; Owner: UGFA
--

SELECT pg_catalog.setval('public."Company_companyid_seq"', 2, true);


--
-- Name: Document_documentId_seq; Type: SEQUENCE SET; Schema: public; Owner: UGFA
--

SELECT pg_catalog.setval('public."Document_documentId_seq"', 1, true);


--
-- Name: Employee_employeeId_seq; Type: SEQUENCE SET; Schema: public; Owner: UGFA
--

SELECT pg_catalog.setval('public."Employee_employeeId_seq"', 6, true);


--
-- Name: Branch branch_pk; Type: CONSTRAINT; Schema: public; Owner: UGFA
--

ALTER TABLE ONLY public."Branch"
    ADD CONSTRAINT branch_pk PRIMARY KEY ("branchId");


--
-- Name: Company company_pk; Type: CONSTRAINT; Schema: public; Owner: UGFA
--

ALTER TABLE ONLY public."Company"
    ADD CONSTRAINT company_pk PRIMARY KEY ("companyId");


--
-- Name: Document document; Type: CONSTRAINT; Schema: public; Owner: UGFA
--

ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT document PRIMARY KEY ("documentId");


--
-- Name: Employee employee_pk; Type: CONSTRAINT; Schema: public; Owner: UGFA
--

ALTER TABLE ONLY public."Employee"
    ADD CONSTRAINT employee_pk PRIMARY KEY ("employeeId");


--
-- Name: Employee username_uk; Type: CONSTRAINT; Schema: public; Owner: UGFA
--

ALTER TABLE ONLY public."Employee"
    ADD CONSTRAINT username_uk UNIQUE (username);


--
-- Name: Employee branch_fk; Type: FK CONSTRAINT; Schema: public; Owner: UGFA
--

ALTER TABLE ONLY public."Employee"
    ADD CONSTRAINT branch_fk FOREIGN KEY ("branchId") REFERENCES public."Branch"("branchId");


--
-- Name: Document branch_fk; Type: FK CONSTRAINT; Schema: public; Owner: UGFA
--

ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT branch_fk FOREIGN KEY ("branchId") REFERENCES public."Branch"("branchId");


--
-- Name: Branch company_fk; Type: FK CONSTRAINT; Schema: public; Owner: UGFA
--

ALTER TABLE ONLY public."Branch"
    ADD CONSTRAINT company_fk FOREIGN KEY ("companyId") REFERENCES public."Company"("companyId");


--
-- PostgreSQL database dump complete
--

