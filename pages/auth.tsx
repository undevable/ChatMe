import { NextPage } from "next";
import { useState } from "react";
import checkIfEmpty from "../utils/validation/checkIfEmpty";
import { supabase } from "../utils/db/supabaseClient";
import removeWhitespace from "../utils/validation/removeWhitespace";
import useRouteGuard from "../utils/guards/useRouteGuard";
import { SessionProps } from "../interfaces/SessionProps";
import Redirecting from "../components/Redirecting";
import { Button, Container, Paper, TextInput, Title } from "@mantine/core";
import Head from "next/head";
import { MdEmail } from "react-icons/md";

const Auth: NextPage<SessionProps> = (props) => {
  const redirecting = useRouteGuard(props.session, true);

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState("");

  const showAlert = (message: string, seconds: number) => {
    setAlert(message);

    setTimeout(() => {
      setAlert("");
    }, seconds * 1000);
  };

  const handleLogin = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email });
      if (error) throw error;
      // TODO: Have an option to disclose the message
      setAlert("Check your email for the login link!");
    } catch (err: any) {
      if (checkIfEmpty(email))
        showAlert("Please provide a valid email address", 1.25);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (redirecting) return <Redirecting />;
  else {
    return (
      <>
        <Head>
          <title>ChatMe</title>
        </Head>
        <Paper mx={150} mt={100}>
          <Title>Sign in via magic link to chat:</Title>
          <p>
            Just enter in your email to get a magic link sent to your email,
            that signs you in instantly!
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin(removeWhitespace(email));
            }}
          >
            <TextInput
              type="email"
              placeholder="Your email"
              value={removeWhitespace(email)}
              onChange={(e) => setEmail(removeWhitespace(e.target.value))}
            />
            <Button type="submit" loading={loading} leftIcon={<MdEmail />} mt="md">Submit</Button>
          </form>
          <p>{!loading && alert}</p>
        </Paper>
      </>
    );
  }
};

export default Auth;
