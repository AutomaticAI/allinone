import React, { useContext, useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { navigate } from "gatsby";
import { Helmet } from "react-helmet";
import { FormattedMessage, IntlProvider, useIntl } from "react-intl";
import "../../configureAmplify";
import {
  ProductDescriptionTool,
  ProductTaglineTool,
} from "../components/ProductTools";
import AppContext from "../contexts/AppContext";
import SignIn from "../components/SignIn";
import TopBar from "../components/TopBar";
import DrawerSideBar from "../components/DrawerSideBar";
import Container from "@mui/material/Container";
import PrivateRoute from "../components/layout/PrivateRoute";
import ProductDescription from "../components/editors/ProductDescription";
import AccountManage from "../components/AccountManage";
import { styled } from "@mui/material/styles";
// @refresh reset
import { Router } from "@reach/router";
import Box from "@mui/material/Box";
import SearchBox from "../components/subcomponents/searchBox";
import useSettings from "../hooks/useSettings";
// import CssBaseline from "@mui/material/CssBaseline";
// import { QuickStats } from "../components/QuickStats";
import LangSettingsDials from "../components/subcomponents/LangSettingsDials";
const inputList = 800;
const MarginBox = styled("div")(({ theme }) => ({
  minHeight: 48,
  [theme.breakpoints.down("sm")]: {
    minHeight: 48,
  },
  [theme.breakpoints.up("sm")]: {
    minHeight: 56,
  },
  [theme.breakpoints.up("md")]: {
    minHeight: 56,
  },
  [theme.breakpoints.up("lg")]: {
    minHeight: 56,
  },
}));

const getValues = (settings) => ({
  direction: settings.direction,
  responsiveFontSizes: settings.responsiveFontSizes,
  theme: settings.theme,
  lang: settings.lang,
});

export default function App() {
  const appContext = useContext(AppContext);
  const [context, setContext] = useState(appContext);
  const { settings, saveSettings } = useSettings();
  /**
   * why state? When the component receives updates, the result is displayed immediately, otherwise we can use ref.
   */
  const [values, setValues] = React.useState(getValues(settings));
  const i18nMessages = require(`../data/messages/${values.lang}`);

  // ................ handle UI lang change ...............
  const handleChange = (field: any, value: any): void => {
    setValues({
      ...values,
      [field]: value,
    });
    // if we set sate as values then be actually updating the prev lang not the new lang
    saveSettings({
      ...values,
      [field]: value,
    });
  };

  const changeLanguage = (event: any, newValue: any) => {
    handleChange("lang", newValue ? newValue.LangCode : "en");
    // saveSettings(values);
  };
  // ................ end handle UI lang change ...............

  useEffect(() => {
    checkUser();
  }, []);

  const [user, setUser] = useState(null);
  useEffect(() => {
    Auth.currentAuthenticatedUser().then(setUser);
  }, []);

  async function checkUser() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setContext({ ...context, userInfo: user });
    } catch (err) {
      setContext({ ...context, userInfo: err });
      navigate("/login");
    }
  }
  const logout = async () => {
    const user = await Auth.currentAuthenticatedUser();
    if (user) {
      Auth.signOut();
      navigate("/auth/login");
    }
  };

  const toggleOpen = () => {
    setContext({ ...context, IsOpen: !context.IsOpen });
  };

  const state = {
    ...context,
    toggleOpen: toggleOpen,
    checkUser: checkUser,
    logout: logout,
  };
  // ################### Handling User auth contexts #########

  if (!user || user == null || user === "The user is not authenticated") {
    return (
      <>
        <SignIn />
      </>
    );
  } else {
    return (
      <AppContext.Provider value={state}>
        <IntlProvider locale={values.lang} messages={i18nMessages}>
          {/* <CacheProvider value={cache}> */}
          <Helmet>
            <meta charSet='utf-8' />
            <meta
              name='viewport'
              content='width=device-width, initial-scale=1.0'
            />
            <title>Maila APP</title>
          </Helmet>
          <Box
            sx={{
              display: "flex",
            }}
          >
            <TopBar
              icon='MenuRoundedIcon'
              title='maila.ai'
              uilang={<LangSettingsDials changeLanguage={changeLanguage} />}
            />
            <DrawerSideBar />
            <Box
              sx={{
                flexGrow: 1,
                height: "100vh",
                overflow: "auto",
              }}
              component='main'
            >
              <MarginBox />
              <Container
                maxWidth='lg'
                sx={{
                  paddingTop: (theme) => theme.spacing(4),
                  paddingBottom: (theme) => theme.spacing(4),
                }}
              >
                <SearchBox />

                {/* <LanguageAutocompleteApp handleChange={changeLanguage} /> */}
                <Router basepath='/app'>
                  <PrivateRoute path='/profile' component={AccountManage} />
                  {/* <PrivateRoute
                        path='/productdescription'
                        component={ProductDescriptionApp}
                      /> */}
                  <ProductDescriptionTool
                    message01=''
                    inputLimitation={inputList}
                    productType='4'
                    productUrl='generate'
                    toneTextField={true}
                    path='/productdescription'
                  />
                  <ProductDescription
                    message01=''
                    mainPlaceholder={<FormattedMessage id='A0013' />}
                    inputLimitation={inputList}
                    productType='9'
                    productUrl='generate'
                    generateButtonName='check'
                    toneTextField={false}
                    headerTitle='Grammar Correction'
                    labelsLists={[]}
                    path='/grammar'
                  />
                  <ProductTaglineTool
                    message01=''
                    mainPlaceholder='Tagline Suggestion'
                    inputLimitation={inputList}
                    productType='10'
                    productUrl='generate'
                    generateButtonName='Tagline Suggestion'
                    toneTextField={true}
                    headerTitle='Tagline'
                    path='/tagline'
                  />
                  <ProductDescription
                    message01=''
                    mainPlaceholder='Describe what your company does.'
                    inputLimitation={inputList}
                    productType='11'
                    productUrl='generate'
                    generateButtonName='Generate Statement'
                    toneTextField={false}
                    headerTitle='Brand Mission Statement'
                    labelsLists={[]}
                    path='/mission-statement'
                  />
                  <ProductDescription
                    message01=''
                    mainPlaceholder='Describe what your company does.'
                    inputLimitation={inputList}
                    productType='12'
                    productUrl='generate'
                    generateButtonName='Generate Statement'
                    toneTextField={false}
                    headerTitle='Brand Vision Statement'
                    labelsLists={[]}
                    path='/vision-statement'
                  />
                  <ProductDescription
                    message01=''
                    mainPlaceholder="Describe your product, and we'll create a value proposition based on your product description."
                    inputLimitation={inputList}
                    productType='20'
                    productUrl='generate'
                    generateButtonName='Generate Statement'
                    toneTextField={false}
                    headerTitle='Value proposition'
                    labelsLists={[]}
                    path='/value-proposition'
                  />
                  <ProductDescription
                    message01=''
                    mainPlaceholder="customize your content based on your company's tone and voice"
                    inputLimitation={inputList}
                    productType='19'
                    productUrl='generate'
                    generateButtonName='Rewrite'
                    toneTextField={true}
                    headerTitle='Rewrite'
                    labelsLists={[]}
                    path='/adjust-tone-rewriting'
                  />
                  <ProductDescription
                    message01=''
                    mainPlaceholder='Write an Email'
                    inputLimitation={inputList}
                    productType='41'
                    productUrl='generate'
                    generateButtonName='Generate Email'
                    toneTextField={false}
                    headerTitle='Write an Email'
                    labelsLists={[]}
                    path='/friendly-email'
                  />
                  <ProductDescription
                    message01=''
                    mainPlaceholder='Paraphrase a passage'
                    inputLimitation={inputList}
                    productType='17'
                    productUrl='generate'
                    generateButtonName='Paraphrase'
                    toneTextField={true}
                    headerTitle='Paraphrase'
                    labelsLists={[]}
                    path='/paraphrase'
                  />
                  <ProductDescription
                    message01=''
                    mainPlaceholder='Paraphrase a passage'
                    inputLimitation={inputList}
                    productType='18'
                    productUrl='generate'
                    generateButtonName='Summary and Paraphrase'
                    toneTextField={true}
                    headerTitle='Summary and Paraphrase'
                    labelsLists={[]}
                    path='/repherase'
                  />
                  <ProductDescription
                    message01=''
                    mainPlaceholder='Cold Email'
                    inputLimitation={inputList}
                    productType='21'
                    productUrl='generate'
                    generateButtonName='Compose'
                    toneTextField={true}
                    headerTitle='Cold Email Template'
                    labelsLists={[]}
                    path='/cold-email'
                  />
                  <ProductDescription
                    message01=''
                    mainPlaceholder='Thank You Email'
                    inputLimitation={inputList}
                    productType='22'
                    productUrl='generate'
                    generateButtonName='Compose'
                    toneTextField={true}
                    headerTitle='Thank You Email'
                    labelsLists={[]}
                    path='/thanks-you-email'
                  />
                  <ProductDescription
                    message01=''
                    mainPlaceholder='Thank You Email'
                    inputLimitation={inputList}
                    productType='22'
                    productUrl='generate'
                    generateButtonName='Compose'
                    toneTextField={true}
                    headerTitle='Thank You Email'
                    labelsLists={[]}
                    path='/thanks-you-email'
                  />
                  <ProductDescription
                    message01='Describe the reasons why you want to reach out and how the customer can contact you.'
                    mainPlaceholder='Describe the reasons why you want to reach out and how the customer can contact you.'
                    inputLimitation={inputList}
                    productType='23'
                    productUrl='generate'
                    generateButtonName='Compose'
                    toneTextField={true}
                    headerTitle='Prospecting email'
                    labelsLists={[]}
                    path='/prospecting-email'
                  />
                  <ProductDescription
                    message01=''
                    mainPlaceholder='Followup Email'
                    inputLimitation={inputList}
                    productType='37'
                    productUrl='generate'
                    generateButtonName='Compose'
                    toneTextField={true}
                    headerTitle='Followup Email'
                    labelsLists={[]}
                    path='/followup-email'
                  />
                  <ProductDescription
                    message01=''
                    mainPlaceholder='Blog Post Intro'
                    inputLimitation={inputList}
                    productType='24'
                    productUrl='generate'
                    generateButtonName='Compose'
                    toneTextField={true}
                    headerTitle='Blog Post Intro'
                    labelsLists={[]}
                    path='/blog-post-intro'
                  />
                  <ProductDescription
                    message01=''
                    mainPlaceholder='Blog Post Ideas'
                    inputLimitation={inputList}
                    productType='39'
                    productUrl='generate'
                    generateButtonName='Compose'
                    toneTextField={true}
                    headerTitle='Blog Post Ideas'
                    labelsLists={[]}
                    path='/blog-post-ideas'
                  />

                  <ProductDescription
                    message01=''
                    mainPlaceholder='Blog Post Conclusion'
                    inputLimitation={inputList}
                    productType='27'
                    productUrl='generate'
                    generateButtonName='Compose'
                    toneTextField={true}
                    headerTitle='Blog Post Conclusion'
                    labelsLists={[]}
                    path='/blog-post-conclusion'
                  />
                  <ProductDescription
                    message01=''
                    mainPlaceholder='Blog Post Summary'
                    inputLimitation={inputList}
                    productType='26'
                    productUrl='generate'
                    generateButtonName='Compose'
                    toneTextField={true}
                    headerTitle='Blog Post Summary'
                    labelsLists={[]}
                    path='/blog-post-summary'
                  />
                  <ProductDescription
                    message01=''
                    mainPlaceholder='Blog Post AIDA'
                    inputLimitation={inputList}
                    productType='25'
                    productUrl='generate'
                    generateButtonName='Compose'
                    toneTextField={true}
                    headerTitle='Blog Post AIDA'
                    labelsLists={[]}
                    path='/blog-post-aida'
                  />
                  <ProductDescription
                    message01=''
                    mainPlaceholder='Blog Post PAS'
                    inputLimitation={inputList}
                    productType='38'
                    productUrl='generate'
                    generateButtonName='Compose'
                    toneTextField={true}
                    headerTitle='Blog Post PAS'
                    labelsLists={[]}
                    path='/blog-post-pas'
                  />
                  <ProductDescription
                    message01=''
                    mainPlaceholder='Blog Post Headline'
                    inputLimitation={inputList}
                    productType='28'
                    productUrl='generate'
                    generateButtonName='Compose'
                    toneTextField={true}
                    headerTitle='Blog Post Headline'
                    labelsLists={[]}
                    path='/blog-post-headline'
                  />
                  <ProductDescription
                    message01=''
                    mainPlaceholder='Landing Page Headline Description'
                    inputLimitation={inputList}
                    productType='29'
                    productUrl='generate'
                    generateButtonName='Compose'
                    toneTextField={true}
                    headerTitle='Landing Page Headline & Headline Description'
                    labelsLists={[]}
                    path='/landing-page-headline-description'
                  />
                  <ProductDescription
                    message01=''
                    mainPlaceholder='landing-page-headline'
                    inputLimitation={inputList}
                    productType='30'
                    productUrl='generate'
                    generateButtonName='Compose'
                    toneTextField={true}
                    headerTitle='landing-page-headline'
                    labelsLists={[]}
                    path='/landing-page-headline'
                  />
                  <ProductDescription
                    message01=''
                    mainPlaceholder='meta-descriptions'
                    inputLimitation={inputList}
                    productType='31'
                    productUrl='generate'
                    generateButtonName='Compose'
                    toneTextField={true}
                    headerTitle='meta-descriptions'
                    labelsLists={[]}
                    path='/meta-descriptions'
                  />
                  <ProductDescription
                    message01=''
                    mainPlaceholder='question-generator'
                    inputLimitation={inputList}
                    productType='32'
                    productUrl='generate'
                    generateButtonName='Compose'
                    toneTextField={false}
                    headerTitle='question-generator'
                    labelsLists={[]}
                    path='/question-generator'
                  />
                  <ProductDescription
                    message01=''
                    mainPlaceholder='subject-finder'
                    inputLimitation={inputList}
                    productType='33'
                    productUrl='generate'
                    generateButtonName='Compose'
                    toneTextField={false}
                    headerTitle='subject-finder'
                    labelsLists={[]}
                    path='/subject-finder'
                  />
                  <ProductDescription
                    message01=''
                    mainPlaceholder='subject-finder'
                    inputLimitation={inputList}
                    productType='34'
                    productUrl='generate'
                    generateButtonName='Compose'
                    toneTextField={false}
                    headerTitle='keyword-related'
                    labelsLists={[]}
                    path='/keyword-finder'
                  />
                  <ProductDescription
                    message01=''
                    mainPlaceholder='Good English'
                    inputLimitation={inputList}
                    productType='35'
                    productUrl='generate'
                    generateButtonName='Compose'
                    toneTextField={false}
                    headerTitle='Good English'
                    labelsLists={[]}
                    path='/grammar'
                  />
                  <ProductDescription
                    message01=''
                    mainPlaceholder='sub-headers'
                    inputLimitation={inputList}
                    productType='36'
                    productUrl='generate'
                    generateButtonName='Compose'
                    toneTextField={false}
                    headerTitle='sub-headers'
                    labelsLists={[]}
                    path='/sub-headers'
                  />
                  <AccountManage path='/profile' />
                </Router>
              </Container>
            </Box>
          </Box>
          {/* </CacheProvider> */}
        </IntlProvider>
      </AppContext.Provider>
    );
  }
}
