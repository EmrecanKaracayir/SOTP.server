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
-- Name: DSOTP; Type: DATABASE; Schema: -; Owner: USOTP
--

CREATE DATABASE "DSOTP" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';


ALTER DATABASE "DSOTP" OWNER TO "USOTP";

\connect "DSOTP"

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
-- Name: Account; Type: TABLE; Schema: public; Owner: USOTP
--

CREATE TABLE public."Account" (
    "accountId" integer NOT NULL,
    username character varying(256) NOT NULL,
    password character varying(256) NOT NULL,
    "sharedOtp" character varying(6) NOT NULL
);


ALTER TABLE public."Account" OWNER TO "USOTP";

--
-- Name: Account_accountId_seq; Type: SEQUENCE; Schema: public; Owner: USOTP
--

CREATE SEQUENCE public."Account_accountId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Account_accountId_seq" OWNER TO "USOTP";

--
-- Name: Account_accountId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: USOTP
--

ALTER SEQUENCE public."Account_accountId_seq" OWNED BY public."Account"."accountId";


--
-- Name: Document; Type: TABLE; Schema: public; Owner: USOTP
--

CREATE TABLE public."Document" (
    "documentId" integer NOT NULL,
    content character varying NOT NULL
);


ALTER TABLE public."Document" OWNER TO "USOTP";

--
-- Name: Document_documentId_seq; Type: SEQUENCE; Schema: public; Owner: USOTP
--

CREATE SEQUENCE public."Document_documentId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Document_documentId_seq" OWNER TO "USOTP";

--
-- Name: Document_documentId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: USOTP
--

ALTER SEQUENCE public."Document_documentId_seq" OWNED BY public."Document"."documentId";


--
-- Name: Pair; Type: TABLE; Schema: public; Owner: USOTP
--

CREATE TABLE public."Pair" (
    "pairId" integer NOT NULL,
    "firstAccountId" integer NOT NULL,
    "secondAccountId" integer NOT NULL,
    "documentId" integer NOT NULL,
    "firstKeySegment" character varying NOT NULL,
    "secondKeySegment" character varying NOT NULL
);


ALTER TABLE public."Pair" OWNER TO "USOTP";

--
-- Name: PairDocView; Type: VIEW; Schema: public; Owner: USOTP
--

CREATE VIEW public."PairDocView" AS
 SELECT p."pairId",
    p."firstAccountId",
    a1.username AS "firstUsername",
    p."secondAccountId",
    a2.username AS "secondUsername",
    p."firstKeySegment",
    p."secondKeySegment",
    p."documentId",
    d.content
   FROM (((public."Pair" p
     JOIN public."Document" d ON ((p."documentId" = d."documentId")))
     JOIN public."Account" a1 ON ((p."firstAccountId" = a1."accountId")))
     JOIN public."Account" a2 ON ((p."secondAccountId" = a2."accountId")));


ALTER VIEW public."PairDocView" OWNER TO "USOTP";

--
-- Name: Pair_pairId_seq; Type: SEQUENCE; Schema: public; Owner: USOTP
--

CREATE SEQUENCE public."Pair_pairId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Pair_pairId_seq" OWNER TO "USOTP";

--
-- Name: Pair_pairId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: USOTP
--

ALTER SEQUENCE public."Pair_pairId_seq" OWNED BY public."Pair"."pairId";


--
-- Name: Account accountId; Type: DEFAULT; Schema: public; Owner: USOTP
--

ALTER TABLE ONLY public."Account" ALTER COLUMN "accountId" SET DEFAULT nextval('public."Account_accountId_seq"'::regclass);


--
-- Name: Document documentId; Type: DEFAULT; Schema: public; Owner: USOTP
--

ALTER TABLE ONLY public."Document" ALTER COLUMN "documentId" SET DEFAULT nextval('public."Document_documentId_seq"'::regclass);


--
-- Name: Pair pairId; Type: DEFAULT; Schema: public; Owner: USOTP
--

ALTER TABLE ONLY public."Pair" ALTER COLUMN "pairId" SET DEFAULT nextval('public."Pair_pairId_seq"'::regclass);


--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: USOTP
--

COPY public."Account" ("accountId", username, password, "sharedOtp") FROM stdin;
2	onur	1231230Aa.	730268
1	emrecan	1231230Aa.	127982
\.


--
-- Data for Name: Document; Type: TABLE DATA; Schema: public; Owner: USOTP
--

COPY public."Document" ("documentId", content) FROM stdin;
\.


--
-- Data for Name: Pair; Type: TABLE DATA; Schema: public; Owner: USOTP
--

COPY public."Pair" ("pairId", "firstAccountId", "secondAccountId", "documentId", "firstKeySegment", "secondKeySegment") FROM stdin;
\.


--
-- Name: Account_accountId_seq; Type: SEQUENCE SET; Schema: public; Owner: USOTP
--

SELECT pg_catalog.setval('public."Account_accountId_seq"', 2, true);


--
-- Name: Document_documentId_seq; Type: SEQUENCE SET; Schema: public; Owner: USOTP
--

SELECT pg_catalog.setval('public."Document_documentId_seq"', 1, true);


--
-- Name: Pair_pairId_seq; Type: SEQUENCE SET; Schema: public; Owner: USOTP
--

SELECT pg_catalog.setval('public."Pair_pairId_seq"', 1, true);


--
-- Name: Account account_pk; Type: CONSTRAINT; Schema: public; Owner: USOTP
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT account_pk PRIMARY KEY ("accountId");


--
-- Name: Document document_pk; Type: CONSTRAINT; Schema: public; Owner: USOTP
--

ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT document_pk PRIMARY KEY ("documentId");


--
-- Name: Pair pair_uk; Type: CONSTRAINT; Schema: public; Owner: USOTP
--

ALTER TABLE ONLY public."Pair"
    ADD CONSTRAINT pair_uk PRIMARY KEY ("pairId");


--
-- Name: Account username_uk; Type: CONSTRAINT; Schema: public; Owner: USOTP
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT username_uk UNIQUE (username);


--
-- Name: Pair document_fk; Type: FK CONSTRAINT; Schema: public; Owner: USOTP
--

ALTER TABLE ONLY public."Pair"
    ADD CONSTRAINT document_fk FOREIGN KEY ("documentId") REFERENCES public."Document"("documentId");


--
-- Name: Pair firstAccountId_fk; Type: FK CONSTRAINT; Schema: public; Owner: USOTP
--

ALTER TABLE ONLY public."Pair"
    ADD CONSTRAINT "firstAccountId_fk" FOREIGN KEY ("firstAccountId") REFERENCES public."Account"("accountId");


--
-- Name: Pair secondAccountId_fk; Type: FK CONSTRAINT; Schema: public; Owner: USOTP
--

ALTER TABLE ONLY public."Pair"
    ADD CONSTRAINT "secondAccountId_fk" FOREIGN KEY ("secondAccountId") REFERENCES public."Account"("accountId");


--
-- PostgreSQL database dump complete
--

