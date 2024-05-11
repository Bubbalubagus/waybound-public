"use client"

import { useState, useEffect } from 'react';
import { useItenaryStore, useStore } from '@/app/stores';

import StepNavigation from "@/components/StepNavigation";

export default function ({ className, ...props }) {
  const [isValid, setIsValid] = useState(false);

  const {
    setPreferredTransport
  } = useItenaryStore();

  // Solves for the Hydration mismatch error
  const preferredTransport = useStore(useItenaryStore, (state) => state.preferredTransport);
  const [wantsToRentCar, setWantsToRentCar] = useState(false);

  useEffect(() => {
    const isValid = preferredTransport && preferredTransport.length > 0;
    setIsValid(isValid);

    // set wantsToRentCar to true if car is selected
    const carSelected = preferredTransport?.find((o) => o.value === 'rental-car');
    setWantsToRentCar(!!carSelected);
  }, [preferredTransport]);

  const toggleOption = (option) => {
    const optionIndex = preferredTransport.findIndex((o) => o.value === option.value);
    if (optionIndex > -1) {
      setPreferredTransport(preferredTransport.filter((o) => o.value !== option.value));
    } else {
      setPreferredTransport([...preferredTransport, option]);
    }
  }

  return (
    <>
      <div>
        <label className="block text-md tracking-tight mt-8 mb-3 font-medium">
          Your preferred method of travel? <span className='italic font-light'>(you can select multiple)</span>
        </label>
        <div className="grid grid-cols-2 gap-2 my-6">
          {travelOptions.map((option, i) => { 
            const isSelected = (preferredTransport || []).find((o) => o.value === option.value);
            return (
            <div 
              key={i} 
              className={`border-2 b-slate-500 rounded-md flex flex-col items-center align-middle justify-center py-8 px-6 hover:b-blue-600 hover:bg-blue-50 hover:cursor-pointer transition-all select-none ${isSelected && 'bg-blue-50 border-blue-600'}`}
              onClick={() => toggleOption(option)}
            >
              <div className='w-12 h-12 m-2 flex items-center justify-center'>
                <option.icon className="max-w-16 max-h-16" />
              </div>
              <p>{option.label}</p>
              <p className='text-xs text-center lowercase'>{option.description}</p>
            </div>
          )})}
        </div>
      </div>

      <StepNavigation isValid={isValid} backPath={"/plan/step-2/"} nextPath={wantsToRentCar ? "/plan/rentACar/" : "/plan/step-4/"} />
    </>
  )
}

const CarIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 100 125"
    {...props}
  >
    <title>{"Best car"}</title>
    <defs>
      <path
        id="a"
        d="M30.208 35.612c2.725-.515 7.647-1.263 13.669-1.369.173 4.24.68 8.988.68 8.988l-19.033-.674 4.684-6.945ZM1.458 49.735c-.182.095-.407.264-.685.544-1.144 1.156-.78 5.005-.409 5.934.372.929.352 2.622.352 2.622l9.04 1.215c.066-1.018.228-6.996 7.338-8.259 8.286.102 9.468 5.368 9.644 8.843.175 3.475.221 2.014.221 2.014s46.662-.078 46.69-.063c-.415-2.744.22-8.405 4.79-10.194 1.31-.513 3.443-1.103 5.355-.727 3.811.75 5.673 2.755 6.504 5.004 1.04 2.814.319 5.874.319 5.874l7.595-.723s.781-.101 1.103-.896c.323-.795-.385-1.355-.385-1.355s.723-1.12 1.026-2.289c.303-1.17-1.072-4.319-1.072-4.319s-.856-.913-1.551-1.134c1.425-5.335-15.329-8.155-15.329-8.155s-2.08-.607-6.314-1.774c-14.99-7.97-20.737-9.37-30.527-9.568-9.791-.199-24.05 2.477-24.05 2.477l-.162.685s-3.839 1.262-7.695 2.231c-3.207.806-6.43 1.319-6.43 1.319s-2.98-.443-3.13.085c-.15.527.45 1.172.45 1.172s.277.202.661.492c-1.03 1.297-3.364 4.704-3.35 8.945Zm.709.11.006.016 2.097-.206 2.936-5.698s.32-.685-.259-1.363c-.246-.288-.79-.748-1.335-1.18-3.11 3.99-3.459 7.139-3.445 8.431Zm84.7-2.952c-.297-.178-.77-.33-.949-.483-.359-.308-.259-.554-.259-.554s1.95-1.076 9.062 3.225c1.687 1.019 1.415 1.91 1.385 2.11.006.028-.58.13-1.239.018-.292-.05-.612.015-.879-.256-.333-.34-1.172-.691-1.939-1.156-1.234-.746-2.463-1.579-2.463-1.579s-1.648-.68-2.72-1.325Zm-56.872 9.309 40.47 1.223.017.643-40.343-.75-.797-1.163.653.047Zm-2.961-20.388-4.4 6.648-2.043-.14s-1.29-.454-2.791-1.295c-.828-.464-1.773-.944-2.476-1.77 2.542-1.363 11.71-3.443 11.71-3.443Zm28.886-.305c-.62-.172-3.26-.746-3.898-.866-4.194-.79-5.496-.595-5.496-.595l1.72 9.269 18.339 1.273s.906-1.65.139-4.767c-1.347-1.017-6.218-3.04-10.804-4.314ZM82.43 67.682a7.537 7.537 0 1 0 0-15.074 7.537 7.537 0 0 0 0 15.074Zm-.083-2.485a4.97 4.97 0 1 0 0-9.939 4.97 4.97 0 0 0 0 9.94Zm-.648-7.744c-.26-.373-.418-.831-.418-.831s.743-.892 2.033-.119c-.17.472-.234.744-.326.956-.161.372-.29.485-.373.609-.165.037-.354.017-.354.017s-.341-.315-.562-.632Zm2.632.687c.193-.411.51-.778.51-.778s1.144.198 1.12 1.7c-.494.09-.761.17-.991.197-.404.046-.565-.01-.714-.019a1.27 1.27 0 0 1-.192-.298s.102-.453.267-.802Zm.72 2.622c.453-.038.93.053.93.053s.4 1.09-.914 1.82c-.324-.383-.528-.574-.666-.76-.241-.326-.274-.494-.34-.628.05-.16.162-.315.162-.315s.444-.138.828-.17Zm-1.91 1.935c.26.373.418.831.418.831s-.743.892-2.032.119c.169-.472.233-.744.325-.956.162-.372.29-.485.373-.609.165-.037.354-.017.354-.017s.341.315.562.632Zm-2.631-.687c-.193.411-.511.778-.511.778s-1.144-.198-1.119-1.7c.493-.09.76-.17.99-.197.404-.046.566.01.715.019.114.124.191.298.191.298s-.102.453-.266.802Zm-.72-2.622c-.454.038-.93-.053-.93-.053s-.4-1.09.914-1.82c.324.383.527.574.665.76.241.326.274.494.34.628a1.27 1.27 0 0 1-.162.315s-.443.138-.828.17Zm1.824 1.126a.497.497 0 1 0-.945-.307.497.497 0 0 0 .945.307Zm.881.36a.497.497 0 1 0-.584.804.497.497 0 0 0 .584-.804Zm.615-.727a.497.497 0 1 0 .584.804.497.497 0 0 0-.584-.804Zm-.501-.809a.497.497 0 1 0 .945-.307.497.497 0 0 0-.945.307Zm-.925.227a.497.497 0 1 0 0-.994.497.497 0 0 0 0 .994Zm.58.994a.414.414 0 1 0 0-.828.414.414 0 0 0 0 .828Zm-64.12 7.123a7.537 7.537 0 1 0 0-15.074 7.537 7.537 0 0 0 0 15.074Zm-.083-2.485a4.97 4.97 0 1 0 0-9.939 4.97 4.97 0 0 0 0 9.94Zm-.647-7.744a3.913 3.913 0 0 1-.419-.831s.743-.892 2.033-.119c-.17.472-.234.744-.326.956-.161.372-.29.485-.373.609-.165.037-.354.017-.354.017s-.34-.315-.561-.632Zm2.63.687c.194-.411.512-.778.512-.778s1.143.198 1.118 1.7c-.493.09-.76.17-.99.197-.403.046-.565-.01-.714-.019a1.27 1.27 0 0 1-.192-.298s.102-.453.267-.802Zm.721 2.622c.453-.038.93.053.93.053s.4 1.09-.914 1.82c-.324-.383-.527-.574-.665-.76-.242-.326-.275-.494-.341-.628.05-.16.162-.315.162-.315s.444-.138.828-.17Zm-1.91 1.935c.26.373.418.831.418.831s-.743.892-2.032.119c.169-.472.233-.744.325-.956.162-.372.29-.485.374-.609.164-.037.353-.017.353-.017s.341.315.562.632Zm-2.631-.687c-.193.411-.511.778-.511.778s-1.143-.198-1.119-1.7c.493-.09.76-.17.99-.197.404-.046.566.01.715.019.114.124.191.298.191.298s-.102.453-.266.802Zm-.72-2.622c-.454.038-.93-.053-.93-.053s-.4-1.09.914-1.82c.324.383.527.574.665.76.242.326.274.494.34.628-.05.16-.162.315-.162.315s-.443.138-.828.17Zm1.824 1.126a.497.497 0 1 0-.945-.307.497.497 0 0 0 .945.307Zm.881.36a.497.497 0 1 0-.584.804.497.497 0 0 0 .584-.804Zm.615-.727a.497.497 0 1 0 .584.804.497.497 0 0 0-.584-.804Zm-.501-.809a.497.497 0 1 0 .945-.307.497.497 0 0 0-.945.307Zm-.925.227a.497.497 0 1 0 0-.994.497.497 0 0 0 0 .994Zm.58.994a.414.414 0 1 0 0-.828.414.414 0 0 0 0 .828Zm0 0"
      />
    </defs>
    <g fill="none" fillRule="evenodd">
      <use xlinkHref="#a" />
      <use xlinkHref="#a" fill="#000" />
    </g>
  </svg>
)


const TrainIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 91 113.75"
    {...props}
  >
    <path d="M44.934 53.264a2.03 2.03 0 0 0 2.031-2.031v-9.206a2.03 2.03 0 0 0-2.031-2.031h-9.207a2.03 2.03 0 0 0-2.031 2.031v9.206a2.03 2.03 0 0 0 2.031 2.031h9.207zM19.478 53.264h9.207a2.03 2.03 0 0 0 2.031-2.031v-9.206c0-1.122-.91-2.031-2.031-2.031H10.813a2.03 2.03 0 1 0 0 4.062h6.634v7.175c0 1.121.909 2.031 2.031 2.031zM88.732 71.489a2.03 2.03 0 1 0 0-4.061H4.854a2.03 2.03 0 1 0 0 4.061h18.55v4.253H12.979a2.03 2.03 0 1 0 0 4.062h75.753a2.03 2.03 0 1 0 0-4.062h-6.02v-4.253h6.02zm-39.166 0h6.985v4.253h-6.985v-4.253zm-4.062 4.253h-6.989v-4.253h6.989v4.253zm15.109-4.253h6.988v4.253h-6.988v-4.253zm-33.146 0h6.986v4.253h-6.986v-4.253zm51.184 4.253h-6.987v-4.253h6.987v4.253zM2.687 51.099h8.126a2.03 2.03 0 1 0 0-4.061H2.687a2.03 2.03 0 1 0 0 4.061z" />
    <path d="M2.28 61.524a2.03 2.03 0 0 0 2.031 2.031H87.18c1.421 0 3.084-.912 3.485-3.472.281-1.793-.143-4.568-1.158-7.722 0-.016.009-.028.009-.045 0-.436-.167-.817-.4-1.148-2.935-8.148-9.685-18.312-19.188-21.366a2.088 2.088 0 0 0-.622-.097h-31.75l-2.874-11.057h3.353a2.031 2.031 0 0 0 0-4.062H26.076a2.031 2.031 0 0 0 0 4.062h4.409l2.874 11.057h-9.277a2.03 2.03 0 1 0 0 4.062h11.846c.02.001.039.01.059.01.026 0 .052-.009.078-.01h32.912c2.7.925 5.146 2.57 7.305 4.602h-3.724a2.03 2.03 0 0 0-2.031 2.031v11.917a2.03 2.03 0 0 0 2.031 2.031H85.93c.774 2.642.861 4.387.726 5.145H65.382V39.861a2.03 2.03 0 0 0-2.031-2.031H52.518a2.031 2.031 0 0 0-2.031 2.031v19.632H4.311a2.03 2.03 0 0 0-2.031 2.031z" />
    <path d="M5.937 33.768h10.292a2.03 2.03 0 1 0 0-4.062H5.937a2.03 2.03 0 1 0 0 4.062z" />
  </svg>
)

const BusIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 100 125"
    {...props}
  >
    <path d="M5.068 52.053c5.746-.728 12.457-1.054 13.057-1.089.498-.03.545.718.045.748-.613.037-7.699.377-13.527 1.151l-.344.056c-.709.108-1.499.675-1.499 1.502l.001 9.168a1.5 1.5 0 0 0 1.5 1.5h.168v-.639a7.99 7.99 0 1 1 15.982 0l-.002 1.317c0 .207.168.375.375.375h42.123a.375.375 0 0 0 .375-.375l-.002-1.317a7.991 7.991 0 1 1 15.982 0l-.002 1.317c0 .207.17.375.375.375h16.52c.828 0 1.498-.672 1.498-1.5V42.341H5.297l-.229 9.712zM90.102 43.7h6.094c.207 0 .375.168.375.375v20.569a.374.374 0 0 1-.375.375h-6.094V43.7zm-.75.008V65.02h-6.125a.374.374 0 0 1-.375-.375V48.722l-.004-2.875c0-1.545 2.802-2.055 6.504-2.139zm-24.209 3.117c0-.621.502-1.125 1.125-1.125h10.445c.621 0 1.125.504 1.125 1.125v4.038c0 .623-.504 1.128-1.125 1.128H66.268a1.125 1.125 0 0 1-1.125-1.128v-4.038zm-14.65 0c0-.621.505-1.125 1.125-1.125h10.446c.621 0 1.125.504 1.125 1.125v4.038c0 .623-.504 1.128-1.125 1.128H51.618c-.62 0-1.125-.505-1.125-1.128v-4.038zm-14.647 0c0-.621.504-1.125 1.125-1.125h10.447c.621 0 1.124.504 1.124 1.125v4.038c0 .623-.503 1.128-1.124 1.128H36.971a1.127 1.127 0 0 1-1.125-1.128v-4.038zm-14.649 0c0-.621.504-1.125 1.125-1.125H32.77c.621 0 1.125.504 1.125 1.125v4.038c0 .623-.504 1.128-1.125 1.128H22.322a1.127 1.127 0 0 1-1.125-1.128v-4.038zM6.285 44.288c0-.207.168-.375.375-.375l.396.002c3.861.08 6.84.332 8.881.654 2.701.424 3.138 1.129 3.138 1.877v3.518a.376.376 0 0 1-.375.375H6.66a.375.375 0 0 1-.375-.375v-5.676zm6.173 14.051A6.11 6.11 0 0 0 6.35 64.45a6.108 6.108 0 0 0 12.218 0 6.11 6.11 0 0 0-6.11-6.111zm0 9.009a2.896 2.896 0 1 1 0-5.792 2.896 2.896 0 0 1 0 5.792zm75.489-45.716-76.399.07c-2.069 0-3.983 1.678-4.272 3.748L5.453 40.091h92.242V31.38c-.002-5.385-4.365-9.748-9.748-9.748zm-68.72 8.814c0 .621-.504 1.125-1.125 1.125H8.564c-.244 0-.655-.246-.655-.625 0-3.35 2.013-5.666 6.206-5.666h3.986c.621 0 1.125.504 1.125 1.125v4.041zm14.668 0c0 .621-.504 1.125-1.125 1.125H22.322c-.62 0-1.125-.504-1.125-1.125v-4.041c0-.621.505-1.125 1.125-1.125H32.77c.621 0 1.125.504 1.125 1.125v4.041zm14.647 0c0 .621-.503 1.125-1.124 1.125H36.971a1.125 1.125 0 0 1-1.125-1.125v-4.041c0-.621.504-1.125 1.125-1.125h10.447c.621 0 1.124.504 1.124 1.125v4.041zm14.647 0c0 .621-.504 1.125-1.125 1.125H51.618c-.62 0-1.125-.504-1.125-1.125v-4.041c0-.621.505-1.125 1.125-1.125h10.446c.621 0 1.125.504 1.125 1.125v4.041zm14.649 0c0 .621-.504 1.125-1.125 1.125H66.268a1.124 1.124 0 0 1-1.125-1.125v-4.041c0-.621.502-1.125 1.125-1.125h10.445c.621 0 1.125.504 1.125 1.125v4.041zm13.607 1.125H80.997a1.125 1.125 0 0 1-1.124-1.125v-4.041c0-.621.503-1.125 1.124-1.125h3.987c4.193 0 7.115 2.316 7.115 5.666.003.379-.41.625-.654.625zM71.311 58.339a6.11 6.11 0 1 0 .003 12.22 6.11 6.11 0 0 0-.003-12.22zm0 9.009a2.897 2.897 0 1 1 .001-5.793 2.897 2.897 0 0 1-.001 5.793z" />
  </svg>
)



const BoatIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 160" {...props}>
    <path d="M54 72.5H38.5v3H57l-1.8-2.4a1.516 1.516 0 0 0-1.199-.6ZM12.12 70.5h7.761c.342 0 .619.277.619.619v.761a.62.62 0 0 1-.62.62h-7.761a.619.619 0 0 1-.619-.619v-.761a.62.62 0 0 1 .62-.62ZM38.5 61.49H74c.124.004 10.716.324 17.919-3.471a25.281 25.281 0 0 1-1.636-1.52H68.841a8.451 8.451 0 0 1-6.631-3.188l-3.04-3.8a2.45 2.45 0 0 1-.294-2.613 2.45 2.45 0 0 1 2.225-1.399H80.32a23.278 23.278 0 0 0-1.582-1.074c-.473-.293-1.054-.6-1.728-.912-4.29-2-8.993-3.014-13.979-3.014h-26.53v14.908a7.424 7.424 0 0 1 2 5.042v1.04ZM46 45.5c3.032 0 5.5 2.467 5.5 5.5s-2.468 5.5-5.5 5.5-5.5-2.467-5.5-5.5 2.468-5.5 5.5-5.5Z" />
    <path d="M34.232 72.886a2.476 2.476 0 0 1 2.237-1.386h17.53c.776 0 1.523.373 1.998.998l2.252 3.002h3.75l-3.6-4.8A5.539 5.539 0 0 0 54 68.5H36.47a5.454 5.454 0 0 0-4.912 3.042L29.579 75.5h3.343l1.311-2.614ZM105 55.71a.99.99 0 0 1 .858-.986l5.562-.888a.501.501 0 0 1 .579.493v6.308l2-.286v-6.492a.5.5 0 0 1 .422-.494l6.42-1.01c.306-.042.595.037.813.224.238.239.345.485.345.76v5.869l.148-.021a4.673 4.673 0 0 1 1.852.12v-5.968c0-.873-.385-1.704-1.057-2.28a2.966 2.966 0 0 0-2.416-.686l-14.999 2.37a2.985 2.985 0 0 0-2.528 2.966v6.213l2-.286v-5.928Z" />
    <path d="m122.289 60.178-42.046 6.006a3.686 3.686 0 0 0-2.777 2.002l-2.86 5.722a4.664 4.664 0 0 1-4.194 2.592H2.402a.903.903 0 0 0-.902.902v7.138h21.37c20.621.292 37.444-.217 52.946-1.598 17.308-1.545 32.195-4.667 45.509-9.543l4.641-7.657a3.685 3.685 0 0 0-.737-4.698 3.69 3.69 0 0 0-2.939-.865Zm-21.197 11.313-16 3a.5.5 0 1 1-.184-.982l16-3a.5.5 0 1 1 .184.982ZM109 73.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5ZM45.5 55.449V51.5h-3.949a4.476 4.476 0 0 0 3.949 3.949Z" />
    <path d="M25.212 69.611a3.879 3.879 0 0 0-3.794-3.111H10.701a3.85 3.85 0 0 0-3.462 2.139L3.809 75.5H26.39l-1.178-5.889Zm-3.712 2.27c0 .893-.727 1.62-1.619 1.62h-7.762a1.621 1.621 0 0 1-1.619-1.62v-.761c0-.893.727-1.62 1.619-1.62h7.762c.893 0 1.619.727 1.619 1.62v.761ZM33.703 85.619c-3.5 0-7.106-.026-10.84-.079H1.5v2.373c0 1.185.508 2.314 1.393 3.1l6.118 5.44a4.151 4.151 0 0 0 2.757 1.047h91.13a6.82 6.82 0 0 0 5.8-3.267l11.806-19.48c-13.1 4.667-27.704 7.677-44.599 9.185-12.729 1.135-26.344 1.681-42.202 1.681Z" />
    <circle cx={109} cy={70} r={2.5} />
    <circle cx={52} cy={7.5} r={2} />
    <path d="M59.775 47.333a1.44 1.44 0 0 0 .175 1.555l3.04 3.799a7.453 7.453 0 0 0 5.85 2.812h20.498c-1.041-1.158-1.938-2.323-2.814-3.472-1.473-1.932-2.901-3.785-4.943-5.528H61.1c-.578 0-1.073.312-1.324.833ZM52 11.424 49.721 17.5h4.558L52 11.424zM73.982 62.49H38.5v5.01H54c2.029 0 3.974.972 5.199 2.599L63.25 75.5h7.161a3.67 3.67 0 0 0 3.3-2.039l2.86-5.722a4.691 4.691 0 0 1 3.531-2.545l19.201-2.743a27.346 27.346 0 0 1-5.084-2.687 26.435 26.435 0 0 1-1.468-1.067c-6.3 3.497-15.047 3.805-17.869 3.805-.512 0-.829-.01-.9-.013Z" />
    <rect width={21} height={4} x={41.5} y={18.5} rx={1.5} ry={1.5} />
    <path d="m64.83 39.546-.005-.014 6.103-2.289a2.435 2.435 0 0 0 1.573-2.27v-1.05a2.427 2.427 0 0 0-2.424-2.424H34.924a2.426 2.426 0 0 0-2.424 2.424v5.576h30.53c.604 0 1.203.017 1.799.046ZM35.5 35a.5.5 0 0 1 .5-.5h32a.5.5 0 0 1 0 1H36a.5.5 0 0 1-.5-.5ZM50.5 23.5h3v7h-3zM46.5 46.551V50.5h3.949a4.476 4.476 0 0 0-3.949-3.949ZM50.449 51.5H46.5v3.949a4.476 4.476 0 0 0 3.949-3.949ZM45.5 46.551a4.476 4.476 0 0 0-3.949 3.949H45.5v-3.949ZM30.5 42v5.55c0 2.009.957 3.923 2.559 5.12l2.441 1.831v-14H32c-.827 0-1.5.673-1.5 1.5Z" />
  </svg>
)


const Bicycle = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 73.125" {...props}>
    <title>{"001Bicycletransport"}</title>
    <path d="M44.12 43h-.44v-.5H44.09Zm.45 0v-.42l.39-.06.09.41Zm-1.31-.07h-.42v-.42h.42Zm-.84-.08H42v-.42h.42Zm3 0-.12-.4h.11l.27-.09.15.4-.29.1Zm-3.85-.05h-.42v-.42h.42Zm-.84-.08h-.42v-.42h.42Zm-.84-.08h-.42v-.42h.42Zm-.84-.08h-.42v-.42h.42Zm7.18 0-.18-.38.36-.19.21.36Zm-8-.07h-.42v-.42h.42Zm-.84-.08h-.42v-.42h.42Zm-.84-.08h-.42v-.42h.42Zm-.84-.08h-.42v-.42h.42Zm-.84-.08h-.42v-.42h.42ZM47 42l-.24-.34.32-.25.28.32Zm-13 0h-.42v-.42H34Zm-.84-.08h-.42v-.42h.42Zm-.84-.08h-.42v-.42h.42Zm-.84-.08h-.42v-.42h.42Zm-.84-.08h-.42v-.42h.42Zm-.84-.08h-.42v-.42h.42Zm-.8-.07h-.42v-.42H29Zm18.65-.06-.3-.29.27-.3.33.26Zm-19.49 0h-.42v-.42h.42Zm-.84-.08h-.42v-.42h.42Zm-.84-.08h-.42v-.42h.42Zm-.84-.08h-.42v-.42h.42Zm-.84-.08h-.42v-.42h.42Zm-.8-.1h-.42v-.42H24Zm-.84-.05h-.42v-.42h.42Zm-.84-.08h-.42v-.42h.42Zm-.84-.08h-.42v-.42h.42Zm26.74 0-.35-.24c.07-.11.15-.22.21-.34l.37.21c-.07.08-.15.2-.23.32Zm-27.58-.07h-.42v-.42h.42Zm-.86-.09a2.32 2.32 0 0 1-.45-.11l.14-.4a1.9 1.9 0 0 0 .37.09Zm-.86-.31a2.39 2.39 0 0 1-.37-.27l.28-.31a2 2 0 0 0 .3.23ZM48.65 40l-.38-.17c.06-.12.11-.25.15-.37l.4.14c-.05.16-.11.3-.17.4Zm-30.41-.32a2.27 2.27 0 0 1-.23-.4l.38-.18a1.85 1.85 0 0 0 .19.32Zm30.7-.51-.41-.1c0-.13.06-.26.08-.39l.42.06c-.03.17-.03.32-.09.46Zm-31.08-.33a2.39 2.39 0 0 1-.06-.46h.42a2 2 0 0 0 0 .38Zm31.21-.54h-.42v-.4h.42v.15c0 .05.01.19 0 .28ZM18.25 38h-.42a2.24 2.24 0 0 1 .13-.45l.39.16a1.82 1.82 0 0 0-.1.29Zm30.38-.52c0-.13 0-.26-.07-.39L49 37c0 .14.06.29.08.43Zm-30.1-.17-.35-.23a2.4 2.4 0 0 1 .29-.36l.3.29a2 2 0 0 0-.24.33Zm.53-.54-.24-.34a2.52 2.52 0 0 1 .4-.23l.18.38a2.11 2.11 0 0 0-.35.21Zm29.4-.06c0-.13-.09-.25-.14-.37l.39-.17c.06.13.11.27.16.41Zm-28.71-.26-.11-.45a1.41 1.41 0 0 1 .36 0 .13.13 0 0 0 .08 0v.42h-.11Zm.81-.12-.05-.42.42-.05.05.42Zm.84-.1-.05-.42.42-.05.05.42Zm.84-.1v-.42l.42-.05.05.42Zm.84-.1v-.42l.42-.05.05.42ZM48.13 36c-.06-.12-.13-.23-.21-.34l.35-.23c.08.12.16.25.22.38ZM23.9 36l-.05-.42.42-.05.05.42Zm.84-.1-.05-.42.42-.05v.42Zm.84-.1-.05-.42.42-.05.05.42Zm.84-.1v-.42h.41v.42Zm.84-.1-.05-.42.42-.05v.42Zm.84-.1L28 35l.42-.05.05.42Zm.84-.1-.05-.42.42-.05.05.42Zm18.78 0-.29-.4.31-.28.28.33Zm-17.94-.06-.05-.42.42-.05.05.42Zm.84-.1v-.42l.42-.05.05.42Zm.84-.1v-.42l.42-.05.05.42Zm.84-.1v-.42l.42-.05.05.42Zm.84-.1-.14-.5h.42l.05.42Zm14.14-.05-.3-.26.26-.33a4.21 4.21 0 0 1 .33.29Zm-13.31 0v-.42h.42l.05.42Zm.84-.1-.05-.42.42-.05.05.42Zm.84-.1-.05-.42.42-.05.05.42Zm.84-.1v-.42l.31-.17.05.42Zm.84-.1-.05-.42.42-.05v.42Zm9.34 0-.35-.2.2-.37.38.22Zm-8.51-.05v-.42h.42l.05.42Zm.84-.1v-.42l.42-.05.05.42Zm.84-.1-.05-.42.42-.05.05.42Zm.84-.1-.05-.42.42-.05v.42Zm5.29 0-.38-.15.14-.4.41.16Zm-4.45-.07-.05-.42.42-.05.05.42Zm.84-.1v-.42l.42-.05.05.42Zm2.85-.09-.39-.08.07-.42.43.09Zm-2 0v-.42l.42-.05.05.42Zm.84-.1v-.42a2.93 2.93 0 0 1 .45 0v.42a2.52 2.52 0 0 0-.5-.22Z" />
    <path d="M79.85 18.19a20 20 0 0 0-7.59 1.49l-2.81-6.24L67.22 8a3.28 3.28 0 0 0 2.92-3.39 3.32 3.32 0 0 0-3.23-3.09L61.08 1a1.25 1.25 0 0 0-.93-.6L56 0a1.26 1.26 0 0 0-1.37 1.13 1.26 1.26 0 0 0 1.17 1.38l4.12.4a1.25 1.25 0 0 0 1.14-.53l5.72.56a1.94 1.94 0 0 1 2 1.75A1.84 1.84 0 0 1 67 6.59l-1.15.08a.7.7 0 0 0-.65.75.85.85 0 0 0 .16.45l2.44 5.57H37l-2-7h-.5a45.57 45.57 0 0 1 5.5-.15h.18a.82.82 0 0 0 .65-.8.79.79 0 0 0-.83-.8H27.16a2.79 2.79 0 0 0-2.31 1.19l-.14.23a2.75 2.75 0 0 0 .46 3.25 2.8 2.8 0 0 0 1 .64 2.83 2.83 0 0 0 .46.13h.54a2.58 2.58 0 0 0 .49 0 3 3 0 0 0 .47-.13l.41-.13a10.24 10.24 0 0 0 3.35-2.27 4 4 0 0 1 1.95-1.05L36 13.74v.06l-5.07 7.49a20.15 20.15 0 1 0 9.27 19.14 4.56 4.56 0 0 0 .66.84l.25.22a.59.59 0 0 0 .31.24 4.58 4.58 0 0 0 5.23.1l5.58 5.37h-.27a1 1 0 0 0-.95.95 1 1 0 0 0 .95.95h4.43a1 1 0 0 0 .95-.95 1 1 0 0 0-.95-.95h-2.25v-.06l-6.25-6.5a4.58 4.58 0 0 0 .07-5.14l20.73-20.07 2.19 4.87a20.14 20.14 0 1 0 9-2.11ZM36.37 16l5.35 18.18a4.43 4.43 0 0 0-1.58 1.62 20.16 20.16 0 0 0-8-13.59Zm-.8 28.65-13-5.41h14.2a16.52 16.52 0 0 1-1.2 5.36ZM3.51 38.44h14.17a2.5 2.5 0 0 0 .13.71l-13.09 5.4a16.55 16.55 0 0 1-1.21-6.11Zm1.23-6.37 13.07 5.44a2.49 2.49 0 0 0-.14.68H3.52a16.55 16.55 0 0 1 1.22-6.12ZM32 26.67a16.7 16.7 0 0 1 3.48 5.2l-13.05 5.38a2.5 2.5 0 0 0-.22-.37l.86-1.28ZM21 36a2.5 2.5 0 0 0-.63-.12V21.7a16.54 16.54 0 0 1 6.1 1.23l-5.39 12.84Zm-.88-.12a2.5 2.5 0 0 0-.66.12L14 22.88a16.55 16.55 0 0 1 6.05-1.17ZM13.76 23l5.39 13.08a2.51 2.51 0 0 0-.66.44l-10-10A16.7 16.7 0 0 1 13.76 23Zm4.73 17.21a2.51 2.51 0 0 0 .59.4l-5.45 13.04a16.7 16.7 0 0 1-5.15-3.46Zm.84.51a2.49 2.49 0 0 0 .74.14V55a16.55 16.55 0 0 1-6.18-1.22Zm1 .14a2.49 2.49 0 0 0 .73-.15l5.38 13.06A16.54 16.54 0 0 1 20.33 55Zm6.37 12.8-5.39-13.08a2.51 2.51 0 0 0 .51-.35l10 10a16.7 16.7 0 0 1-5.12 3.41Zm-4.1-16-.06-.18 13.05-5.38a16.53 16.53 0 0 1 1.19 5.56Zm9.21-11.22-7.9 7.9 6.29-9.3a16.78 16.78 0 0 1 1.61 1.43Zm-9.94 8.16L26.69 23a16.61 16.61 0 0 1 2.23 1.16ZM8.29 26.69l10 10a2.51 2.51 0 0 0-.37.56L4.85 31.81a16.7 16.7 0 0 1 3.44-5.12Zm9.63 12.73a2.51 2.51 0 0 0 .38.57l-10 10a16.7 16.7 0 0 1-3.47-5.18ZM32 50 22 40a2.51 2.51 0 0 0 .41-.6l13 5.43A16.7 16.7 0 0 1 32 50Zm8.29-12.32v-.31l.62.36Zm4.78-1.53A.55.55 0 0 1 45 36l-.28-1.79a3.85 3.85 0 0 1 1.62.68Zm-1.62-1.61-.09-.31h.17Zm-1.05 1.88-1.69-.25a3.8 3.8 0 0 1 1.22-1.34Zm-2 2.77h1.54l-.71 1.45a3.84 3.84 0 0 1-.83-1.45Zm1.79 2.22 1.39-1.28a.56.56 0 0 1 .77 0l1.4 1.39a3.88 3.88 0 0 1-3.56-.11Zm5.16-1.27-1.43-1.49a.56.56 0 0 1 .28-.32l1.73-.86a3.88 3.88 0 0 1-.58 2.67Zm.22-3.82h-.54l.37-.35c.06.15.11.25.16.35Zm-.68-1.91a4.55 4.55 0 0 0-2.53-.94.59.59 0 0 0-.38 0 4.6 4.6 0 0 0-.8.09l-5.5-18.62H67ZM95.26 44.6l-13-5.43a2.49 2.49 0 0 0 .14-.73h14.09a16.55 16.55 0 0 1-1.23 6.16ZM63.2 38.44h14.17a2.5 2.5 0 0 0 .13.71l-13.09 5.4a16.55 16.55 0 0 1-1.21-6.11Zm1.23-6.37 13.07 5.44a2.49 2.49 0 0 0-.14.68H63.21a16.54 16.54 0 0 1 1.22-6.12Zm9.28-9.19a16.55 16.55 0 0 1 6.11-1.18v14.14h-.27l-5.66-12.55Zm22.77 15.31H82.37a2.49 2.49 0 0 0-.14-.68l13.05-5.38a16.54 16.54 0 0 1 1.2 6.06Zm-15-1.74a2.51 2.51 0 0 0-.57-.37l5.43-13a16.7 16.7 0 0 1 5.12 3.44Zm-.79-.45a2.49 2.49 0 0 0-.61-.13V21.71a16.54 16.54 0 0 1 6 1.23Zm-2.51 4.22a2.51 2.51 0 0 0 .59.4l-5.45 13.03a16.7 16.7 0 0 1-5.15-3.46Zm.84.51a2.5 2.5 0 0 0 .8.15V55a16.55 16.55 0 0 1-6.24-1.23Zm1.05.14a2.49 2.49 0 0 0 .67-.15l5.38 13.06A16.54 16.54 0 0 1 80.08 55Zm6.31 12.8L81 40.58a2.51 2.51 0 0 0 .51-.35l10 10a16.7 16.7 0 0 1-5.12 3.41Zm-4.26-16.42a2.51 2.51 0 0 0-.41-.6l10-10a16.7 16.7 0 0 1 3.48 5.2Zm-4-.78-10-10a16.72 16.72 0 0 1 4.15-3ZM68 26.69l10 10a2.51 2.51 0 0 0-.37.56l-13.09-5.44A16.7 16.7 0 0 1 68 26.69Zm9.63 12.73A2.51 2.51 0 0 0 78 40L68 50a16.7 16.7 0 0 1-3.47-5.18ZM91.7 50l-10-10a2.51 2.51 0 0 0 .41-.6l13 5.43A16.7 16.7 0 0 1 91.7 50ZM40.83 5.46Z" />
  </svg>
)


const HikingIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    data-name="Layer 1"
    viewBox="0 0 128 160"
    {...props}
  >
    <title>{"travle"}</title>
    <circle
      cx={40.016}
      cy={22.635}
      r={7.193}
      transform="rotate(-3.278 40.016 22.635)"
    />
    <path d="M109.215 36.075h-3.34a4.79 4.79 0 0 0-3.597 1.627l-9.79 11.134-7.004.487a4.786 4.786 0 0 0-3.924 2.593l-5.61 10.97-7.456-.948a4.788 4.788 0 0 0-4.148 1.536L44.891 84.95l-2.68-1.937a4.79 4.79 0 0 0-5.319-.191L16.27 95.58a4.8 4.8 0 0 0-2.27 4.07v8.122a4.785 4.785 0 0 0 4.785 4.785h90.43a4.785 4.785 0 0 0 4.785-4.785V40.86a4.785 4.785 0 0 0-4.785-4.785ZM67.692 88.686l-18.586 5.861 20.66-22.801 8.312 1.057-11.526 10.87Zm33.155-15.532 4.425 3.418-8.527 13.062-1.358-9.343-9.885 2.853 5.47-10.75-2.886-5.392 4.558-7.684 12.628-.935-6.553 7.324Z" />
    <path d="M58.236 34.945a3.279 3.279 0 0 0-4.76-4.32l-.999-.906a2.068 2.068 0 1 0-2.778 3.063l1.035.942-1.915 2.271-8.715-.63c-.891-.064-1.775-.196-2.662-.302a6.559 6.559 0 0 0-4.985 1.49 5.46 5.46 0 0 0-3.345-2.06 5.595 5.595 0 0 0-6.37 4.23L19.44 52.023a2.387 2.387 0 0 0 1.742 2.892l4.83 1.199a11.255 11.255 0 0 0-.084 4.874v.005l.518 12.01s-2 6.56-3.123 10.297a1.005 1.005 0 0 0 1.492 1.142l7.053-4.364a1.005 1.005 0 0 0 .432-.56l1.514-4.932a3.735 3.735 0 0 0 .16-1.262l-.307-7.036a1.492 1.492 0 0 1 .916-1.45 6.547 6.547 0 0 0 1.865-1.16 1.527 1.527 0 0 1 1.359-.359l4.922 1.146.049 12.023a.992.992 0 0 0 .65.934q.407.145.802.328a.995.995 0 0 0 1.152-.24l4.624-5.103a1.005 1.005 0 0 0 .26-.68l-.045-10.263a3.745 3.745 0 0 0-2.902-3.637l-5.866-1.365a1.832 1.832 0 0 1-1.358-2.243l2.777-10.723a1.601 1.601 0 0 1 1.653-1.2c2.062.132 5.821.372 5.919.365a3.286 3.286 0 0 0 2.323-1.16l2.83-3.357 18.99 17.244a.503.503 0 0 0 .786-.143l1.48-2.892a.503.503 0 0 0-.109-.6Z" />
  </svg>
)

// ICONS FROM THENOUNPROJECT.COM
const travelOptions = [
  {
    icon: TrainIcon,
    value: "train",
    label: "Train",
    description: "fan of looking out the window of a swiftly moving train cabin?",
  },
  {
    icon: CarIcon,
    value: "rental-car",
    label: "Rent a car",
    description: "Rent a car to get around.",
  },
  {
    icon: BusIcon,
    value: "public-transportation",
    label: "Public Transportation",
    description: "Do you enjoy moving around using the bus or metro?",
  },
  {
    icon: BoatIcon,
    value: "boat-or-ferry",
    label: "Boat or Ferry",
    description: "Take a boat or ferry to get on the water.",
  },
  {
    icon: Bicycle,
    value: "bicycle-or-electric-scooter",
    label: "Bicycle or Scooter",
    description: "Rent a bicycle or electric scooter to zip around.",
  },
  {
    icon: HikingIcon,
    value: "walking",
    label: "Walking or hiking",
    description: "Enjoy walking or hiking to get around.",
  },
];
