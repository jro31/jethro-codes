import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import SectionHome from '../components/layout/main-content/section-home';

import { testReducerActions } from '../store/test-reducer';

const appTitle = 'My project name'; // TODO - Update this
const appDescription = 'This is the description about my project'; // TODO - Update this
const baseUrl = 'https://my-url.com'; // TODO - Update this
const socialMediaImagePath = `${baseUrl}/images/my-image-name.png`; // TODO - Update this

const Home = () => {
  const dispatch = useDispatch();
  const testReducerState = useSelector(state => state.testReducer.testReducerState);

  const testClickHandler = () => {
    dispatch(testReducerActions.setTestReducerState());
  };

  return (
    <>
      <Head>
        <title>{appTitle}</title>
        <meta name='description' content={appDescription} />
        {/* TODO - Update keywords */}
        <meta name='keywords' content='these, are, some, keywords, about, my project' />

        {/* Facebook */}
        <meta property='og:title' content={appTitle} />
        <meta property='og:description' content={appDescription} />
        <meta property='og:type' content='website' />
        <meta property='og:url' content={baseUrl} />
        <meta property='og:image' content={socialMediaImagePath} />

        {/* Twitter */}
        <meta name='twitter:title' content={appTitle} />
        {/* TODO <meta name='twitter:site' content='@my-site-twitter-handle' /> */}
        <meta name='twitter:description' content={appDescription} />
        <meta name='twitter:image' content={socialMediaImagePath} />
        <meta name='twitter:card' content='summary_large_image' />
      </Head>

      <SectionHome>
        <div className='bg-white rounded-lg'>
          <div className='text-2xl'>CONTENT GOES HERE</div>
          <div onClick={testClickHandler}>
            The test reducer state is {testReducerState.toString()}
          </div>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit eget diam euismod
            euismod. Suspendisse ultricies dictum neque et tincidunt. Vivamus hendrerit lacus non
            urna placerat hendrerit. Sed sollicitudin scelerisque vehicula. Donec vel facilisis
            nisi. Ut porta condimentum dolor, non pretium metus congue eu. Donec a tellus quis ante
            lacinia sollicitudin ac id tortor. Aenean viverra, metus egestas sagittis volutpat, nunc
            urna luctus neque, non posuere nunc neque quis diam. Donec nec mauris massa. Sed
            sagittis interdum porta. Vestibulum fermentum felis est, a molestie purus dictum eu.
            Aenean maximus auctor dui vel condimentum. Nullam non lectus sit amet risus congue
            efficitur. Sed at ullamcorper mi, ac mattis magna. In vitae faucibus diam. Curabitur
            ullamcorper nisi non mollis pellentesque. Suspendisse quis pharetra ipsum. Aenean
            consequat purus sed imperdiet lobortis. Integer scelerisque, ante sit amet porttitor
            cursus, diam libero interdum metus, quis ultricies risus massa eget mauris. Nam in enim
            pellentesque, consequat risus non, luctus augue. Nam felis sapien, iaculis et tempor
            vel, dictum ut ante. Donec dapibus risus ac felis tincidunt scelerisque. Nunc
            sollicitudin vitae massa non euismod. In facilisis, odio in venenatis commodo, velit
            eros ullamcorper tellus, sit amet lacinia arcu metus sit amet lectus. Donec nisl massa,
            suscipit vel ipsum ac, pulvinar tristique turpis. Sed vestibulum fermentum arcu ac
            tincidunt. Sed facilisis dui urna, non porttitor diam hendrerit id. Aenean in leo vitae
            nulla dignissim laoreet eget id est. Nunc auctor dolor quis magna mollis, eu efficitur
            felis luctus. Sed suscipit, orci sed condimentum suscipit, nunc dui ornare dui,
            imperdiet sodales nibh risus vitae mi. Sed elementum, ipsum convallis varius tristique,
            erat sem rutrum ex, in rutrum sem ipsum nec ligula. Pellentesque efficitur neque sed
            erat efficitur luctus. Fusce vitae posuere urna. Pellentesque euismod justo vitae orci
            sodales, sed feugiat lacus dapibus. Ut erat nisi, ultricies at nisl sed, sagittis rutrum
            orci. Nullam ac ex a metus sagittis auctor. Nunc dapibus accumsan ipsum at luctus. Proin
            scelerisque sollicitudin nisi, at dapibus risus blandit sed. Curabitur cursus posuere mi
            et faucibus. Sed consectetur diam porttitor risus eleifend faucibus. Quisque quam ante,
            pharetra at ultricies ac, efficitur aliquam libero. Pellentesque vestibulum in arcu at
            bibendum. Sed sapien turpis, fringilla non orci vitae, commodo mattis tortor. Morbi eu
            convallis leo, ac iaculis turpis. Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Sed vulputate aliquet aliquet. Phasellus luctus at erat eu tincidunt. Mauris
            sagittis lacus ut lacinia ultrices. Praesent mollis dui cursus, laoreet sem non, dapibus
            nibh. Quisque molestie, dui et ultrices porttitor, est felis molestie leo, hendrerit
            pellentesque odio justo in odio. Nulla facilisi. Integer mattis, ipsum eu sagittis
            hendrerit, est massa bibendum dui, eget varius nisl augue nec justo. Pellentesque
            habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce
            bibendum nec nisl a commodo. Praesent egestas euismod finibus. Morbi eu ipsum eu erat
            cursus mattis eget eu lectus. Donec ut aliquet libero, eget efficitur augue. Sed at
            aliquam tellus, a aliquam tellus. Mauris sed metus sit amet odio semper dapibus. In
            ornare pharetra hendrerit. Morbi elementum magna consectetur, consectetur nunc nec,
            aliquam purus. Aliquam et neque eget nisi facilisis blandit vitae in diam. Quisque
            ultrices, sem non efficitur mattis, massa lacus blandit metus, quis tincidunt ligula
            mauris sit amet justo. Cras id maximus velit. Curabitur tempus a orci nec aliquet. Nunc
            risus magna, eleifend non sodales venenatis, porta in urna. Donec in felis interdum,
            bibendum enim nec, varius mauris. Phasellus efficitur sapien ac varius egestas. Morbi
            ligula metus, tincidunt quis euismod eu, tincidunt non sapien. In hac habitasse platea
            dictumst. Maecenas sit amet eleifend nulla. Aenean enim lectus, euismod ut enim eu,
            maximus vulputate erat. Suspendisse auctor, erat a placerat interdum, augue risus
            maximus tellus, quis pulvinar sem turpis pulvinar mauris. Etiam sodales, nibh at
            scelerisque facilisis, nisl libero aliquam sapien, ut laoreet libero nisl nec nisi.
            Maecenas blandit urna sed massa interdum, at aliquet risus feugiat. Quisque efficitur mi
            tempus odio pretium egestas. Sed at lacinia nunc. Pellentesque habitant morbi tristique
            senectus et netus et malesuada fames ac turpis egestas. Phasellus tempor turpis turpis,
            eu laoreet leo finibus eget. Nullam quis erat non neque tempus convallis suscipit ut
            enim. Nam vel tellus a libero lobortis rhoncus. Vestibulum aliquam nisi nunc, quis
            hendrerit metus interdum sed. Duis varius turpis id dolor convallis efficitur. Curabitur
            gravida posuere cursus. Cras finibus, velit at elementum ornare, neque ipsum fringilla
            dui, scelerisque imperdiet ex felis vel nibh. Maecenas vitae nisl metus. Duis at viverra
            sapien. Nullam eu interdum mauris. Curabitur id tortor et ligula eleifend malesuada sed
            feugiat tortor. Pellentesque sem libero, elementum vel vulputate vitae, cursus ut
            lectus. Nunc condimentum suscipit erat, facilisis faucibus ante sollicitudin cursus.
            Vivamus convallis ante turpis, vel condimentum lacus blandit a. Proin luctus urna ac
            urna malesuada volutpat. Morbi eu leo feugiat, venenatis dui vitae, posuere nibh.
            Vivamus ut enim eget ipsum porttitor imperdiet. Praesent nec elit ultrices orci rhoncus
            rutrum vitae nec tortor. Pellentesque elementum vulputate ligula in facilisis. Proin nec
            faucibus arcu. Nunc porttitor pretium eros, at pulvinar diam egestas quis. Nam sem est,
            tempus id venenatis eget, vehicula vel nisl. Etiam nec nunc et velit rutrum imperdiet
            quis id lectus. Sed commodo mauris sed leo dapibus venenatis. Fusce placerat venenatis
            iaculis. Cras semper mi ex, sed varius turpis euismod tincidunt. Pellentesque feugiat
            aliquam elit, in volutpat felis imperdiet at. Aenean id ornare sapien. Donec sit amet
            est nulla. Vestibulum viverra odio eget laoreet fringilla. Donec fermentum felis sapien,
            eget pellentesque neque eleifend sit amet. Sed ultrices et risus sit amet ullamcorper.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In gravida eros eu ligula
            hendrerit dictum. Quisque consequat facilisis tempor. Suspendisse a laoreet odio.
            Suspendisse eget arcu massa. Ut ornare, lectus eget varius dictum, nulla dolor placerat
            eros, vel condimentum leo diam mattis quam. Phasellus tristique tellus sit amet urna
            ullamcorper cursus. Nulla a felis suscipit, fermentum arcu vestibulum, efficitur eros.
            Curabitur commodo lacus diam, et tristique quam varius non. Pellentesque ac tellus urna.
            Morbi et arcu fermentum, suscipit nulla fermentum, tempor neque. Suspendisse potenti.
            Praesent nec sapien tellus. In at vulputate ipsum, at interdum elit.
          </div>
        </div>
      </SectionHome>
    </>
  );
};

export default Home;
