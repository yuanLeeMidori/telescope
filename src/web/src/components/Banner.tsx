import { useEffect, useState, createRef, createContext } from 'react';
import { makeStyles, Theme, createStyles, Fab, Typography } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { telescopeUrl } from '../config';
import BannerDynamicItems from './BannerDynamicItems';
import ScrollAction from './ScrollAction';
import LandingButtons from './BannerButtons';
import { useBanner } from './BannerContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    heroBanner: {
      maxHeight: '100vh',
      overflow: 'hidden',
      position: 'relative',
    },
    textsContainer: {
      position: 'absolute',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      top: '40%',
    },
    title: {
      color: '#A0D1FB',
      fontWeight: 'bold',
      fontSize: 'clamp(3.2rem, 3.5vw, 6.5rem)',
      letterSpacing: '.45em',
      display: 'block',
      zIndex: 1000,
      marginBottom: '25px',
    },
    quoteText: {
      width: '70%',
      color: '#FFFFFF',
      fontSize: 'clamp(1.6rem, 1.2vw, 2.5rem)',
      display: 'block',
      textAlign: 'center',
      zIndex: 1000,
    },
    version: {
      position: 'absolute',
      opacity: 0.85,
      bottom: theme.spacing(3),
      left: theme.spacing(3),
      fontSize: '1.3em',
      color: 'white',
      textDecorationLine: 'none',
      '&:hover': {
        textDecorationLine: 'underline',
      },
    },
    icon: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
      position: 'absolute',
      bottom: theme.spacing(1),
      zIndex: 300,
      margin: '0 auto',
      '& .MuiFab-root': {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        display: 'grid',
      },
      [theme.breakpoints.down(1024)]: {
        marginBottom: '60px',
      },
    },
    anchor: {
      position: 'relative',
    },
    container: {
      bottom: '0',
    },
    arrowDownIcon: {
      color: 'white',
      fontSize: '4em',
    },
  })
);

export default function Banner() {
  const classes = useStyles();
  const [gitInfo, setGitInfo] = useState({
    gitHubUrl: '',
    sha: '',
    version: '',
  });

  useEffect(() => {
    async function getGitData() {
      try {
        const res = await fetch(`${telescopeUrl}/health`);

        // Fetch failure
        if (!res.ok) {
          throw new Error(res.statusText);
        }

        const data = await res.json();
        setGitInfo(data.info);
      } catch (error) {
        console.error(`Error retrieving site's health info`, error);
      }
    }
    getGitData();
  }, [telescopeUrl]);

  // Observer banner
  // const [bannerVisible, setBannerVisible] = useState<boolean>(false);
  const dispatch = useBanner();
  console.log(dispatch);
  const bannerRef = createRef<HTMLButtonElement>();
  useEffect(() => {
    const options = {
      root: null,
      threshold: 0.9,
    };

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log('BANNER VISIBLE:', entry);
            // fire action to context
            // dispatch({ type: 'BANNER_IS_VISIBLE' });
          }
          if (!entry.isIntersecting) {
            console.log('BANNER NOT VISIBLE', entry);
            // fire action to context
          }
        }),
      options
    );
    observer.observe(bannerRef.current!);

    const buttonRefCopy = bannerRef.current;

    return () => {
      observer.unobserve(buttonRefCopy as HTMLButtonElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className={classes.heroBanner}>
        <BannerDynamicItems />
        <LandingButtons />
      </div>
      <div className={classes.textsContainer}>
        <Typography variant="h1" className={classes.title}>
          Telescope
        </Typography>
        <Typography variant="h4" className={classes.quoteText}>
          “I think one of my proudest contributions to date was for Node.js.
          <br /> This is something I never would have imagined contributing to even just a year
          ago.”
        </Typography>
      </div>
      <div className={classes.icon}>
        <a
          href={`${gitInfo.gitHubUrl}`}
          title={`git commit ${gitInfo.sha}`}
          className={classes.version}
        >
          v {gitInfo.version}
        </a>
        <ScrollAction>
          <Fab color="primary" aria-label="scroll-down">
            <KeyboardArrowDownIcon className={classes.arrowDownIcon} />
          </Fab>
        </ScrollAction>
      </div>
      <div className={classes.anchor} ref={bannerRef} id="posts-anchor" />
    </>
  );
}
