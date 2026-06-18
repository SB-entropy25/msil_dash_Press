import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { vendorStyles } from "./styles";
import { vendorStyles as styles } from "./styles";
import IotBlueLogo from "../../assets/icons/IotBlueLogo.svg";
import PrimaryButton from "../Buttons/PrimaryButton/PrimaryButton";
import { Grey20, MarutiSilver500, Red } from "../../utils/colors";
import { loginApi } from "../../Repository/authRepository";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    const payload = {
      username: username,
      password: password,
      platform: "web",
      ldap_bind: username === "dilpreet" ? false : true,
    };
    loginApi(payload)
      .then((res) => {
        if (res?.data?.status_code === "200") {
          setErrorText("");
          const token = res.data?.data?.access_token;
          const refToken = res.data?.data?.refresh_token;
          const tokenType = "Bearer"; // res.data?.data?.token_type;
          localStorage.setItem("id_token", `${tokenType} ${token}`);
          localStorage.setItem("refresh_token", refToken);
          setTimeout(() => {
            navigate("/Prodigi");
          }, 200);
        } else {
          setErrorText(res?.data?.msg || "Something went wrong.");
        }
      })
      .catch((err) => {
        setErrorText("Something went wrong.");
      });
  };
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box sx={styles.main}>
      <Container maxWidth="sm" sx={{ mt: 12 }}>
        <Paper
          elevation={10}
          sx={{
            p: 6,
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={IotBlueLogo}
            style={{
              height: "5rem",
              width: "auto",
              marginBottom: "2rem",
            }}
          />

          <Box component="form" sx={{ mt: 2.2 }}>
            <Typography sx={styles.inputLabel}>Username</Typography>
            <TextField
              fullWidth
              autoComplete="off"
              variant="outlined"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrorText("");
              }}
              sx={{
                mb: 3,
                "& input:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 1000px white inset",
                  WebkitTextFillColor: "#000",
                  transition: "background-color 5000s ease-in-out 0s",
                },
                input: { p: 0 },
              }}
            />
            <Typography sx={styles.inputLabel}>Password</Typography>
            <TextField
              sx={{
                ...vendorStyles["input"],
                "& input:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 1000px white inset",
                  WebkitTextFillColor: "#000",
                  transition: "background-color 5000s ease-in-out 0s",
                },
                input: { p: 0 },
              }}
              fullWidth
              variant="outlined"
              autoComplete="off"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorText("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && username && password) {
                  handleLogin();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errorText && (
              <Typography sx={{ color: Red, mt: -1 }}>{errorText}</Typography>
            )}

            <Box sx={{ width: "50rem", pt: 2 }}>
              <PrimaryButton
                sx={{
                  height: "4rem !important",
                  width: "50rem !important",
                  mmarginTop: "4rem !important",
                  "&.Mui-disabled": {
                    color: MarutiSilver500,
                    backgroundColor: Grey20,
                    opacity: 1,
                  },
                }}
                onClick={handleLogin}
                disabled={!username || !password}
              >
                Submit
              </PrimaryButton>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
