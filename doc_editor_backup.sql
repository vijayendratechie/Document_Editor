--
-- PostgreSQL database dump
--

-- Dumped from database version 14.15 (Homebrew)
-- Dumped by pg_dump version 14.15 (Homebrew)

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
-- Name: document_access; Type: TABLE; Schema: public; Owner: vijayendrapagare
--

CREATE TABLE public.document_access (
    doc_id character varying(200) NOT NULL,
    user_id integer NOT NULL,
    access character varying(50) NOT NULL
);


ALTER TABLE public.document_access OWNER TO vijayendrapagare;

--
-- Name: documents; Type: TABLE; Schema: public; Owner: vijayendrapagare
--

CREATE TABLE public.documents (
    doc_id character varying(200) NOT NULL,
    doc_name character varying(200) NOT NULL
);


ALTER TABLE public.documents OWNER TO vijayendrapagare;

--
-- Name: users; Type: TABLE; Schema: public; Owner: vijayendrapagare
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL
);


ALTER TABLE public.users OWNER TO vijayendrapagare;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: vijayendrapagare
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO vijayendrapagare;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vijayendrapagare
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: vijayendrapagare
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: document_access; Type: TABLE DATA; Schema: public; Owner: vijayendrapagare
--

COPY public.document_access (doc_id, user_id, access) FROM stdin;
ddae4dba-b617-4f23-8bec-27de0f89e3df	1	owner
ddae4dba-b617-4f23-8bec-27de0f89e3df	2	write
ddae4dba-b617-4f23-8bec-27de0f89e3df	3	write
\.


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: vijayendrapagare
--

COPY public.documents (doc_id, doc_name) FROM stdin;
ddae4dba-b617-4f23-8bec-27de0f89e3df	doc 1.1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: vijayendrapagare
--

COPY public.users (user_id, name, email) FROM stdin;
1	vijju	vijju@gmail.com
2	sam	sam@gmail.com
3	rahul	rahul@gmail.com
\.


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vijayendrapagare
--

SELECT pg_catalog.setval('public.users_user_id_seq', 1, false);


--
-- Name: document_access document_access_pkey; Type: CONSTRAINT; Schema: public; Owner: vijayendrapagare
--

ALTER TABLE ONLY public.document_access
    ADD CONSTRAINT document_access_pkey PRIMARY KEY (doc_id, user_id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: vijayendrapagare
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (doc_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: vijayendrapagare
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: vijayendrapagare
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: document_access document_access_doc_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vijayendrapagare
--

ALTER TABLE ONLY public.document_access
    ADD CONSTRAINT document_access_doc_id_fkey FOREIGN KEY (doc_id) REFERENCES public.documents(doc_id) ON DELETE CASCADE;


--
-- Name: document_access document_access_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vijayendrapagare
--

ALTER TABLE ONLY public.document_access
    ADD CONSTRAINT document_access_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

