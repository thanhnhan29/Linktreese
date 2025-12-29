import svgPaths from "./svg-du8004kdwc";
import imgFrame from "figma:asset/a3d78743adbd2d2160e019486919a6bb2862cbcd.png";

function Frame() {
  return (
    <div className="absolute h-[694px] left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-[470.328px]" data-name="Frame">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[158.84%] left-0 max-w-none top-[-29.42%] w-full" src={imgFrame} />
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute bg-[#254f1a] h-[694px] left-[940.67px] overflow-clip right-0 top-0" data-name="Frame">
      <Frame />
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-[#f6f7f5] h-[48px] relative rounded-[8px] shrink-0 w-[588px]" data-name="Frame">
      <div className="absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[17px] justify-center leading-[0] left-[16px] not-italic text-[14px] text-black top-[31.5px] translate-y-[-50%] w-[556.2px]">
        <p className="leading-[48px]">Tell us your name</p>
      </div>
    </div>
  );
}

function AutoLayoutHorizontal() {
  return (
    <div className="absolute content-stretch flex inset-[13px_456px_14px_16px] items-start overflow-clip" data-name="Auto Layout Horizontal">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#676b5f] text-[14px] text-nowrap">
        <p className="leading-[21px] whitespace-pre">Tell us your name</p>
      </div>
    </div>
  );
}

function AutoLayoutHorizontal1() {
  return (
    <div className="basis-0 content-stretch flex grow items-start min-h-px min-w-px relative shrink-0" data-name="Auto Layout Horizontal">
      <Frame2 />
      <AutoLayoutHorizontal />
    </div>
  );
}

function AutoLayoutHorizontal2() {
  return (
    <div className="box-border content-stretch flex items-start overflow-clip p-[2px] relative rounded-[10px] shrink-0" data-name="Auto Layout Horizontal">
      <AutoLayoutHorizontal1 />
    </div>
  );
}

function AutoLayoutHorizontal3() {
  return (
    <div className="content-stretch flex items-start overflow-clip relative rounded-[10px] shrink-0" data-name="Auto Layout Horizontal">
      <AutoLayoutHorizontal2 />
    </div>
  );
}

function AutoLayoutHorizontal4() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[12px] items-start leading-[0] not-italic overflow-clip relative shrink-0 text-[14px] text-black text-nowrap" data-name="Auto Layout Horizontal">
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[21px] text-nowrap whitespace-pre">🏢</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[21px] text-nowrap whitespace-pre">Business</p>
      </div>
    </div>
  );
}

function AutoLayoutHorizontal5() {
  return (
    <div className="absolute bg-white box-border content-stretch flex items-start left-[8px] pb-[9px] pl-[17px] pr-[16.875px] pt-[10px] rounded-[24px] top-[41px]" data-name="Auto Layout Horizontal">
      <div aria-hidden="true" className="absolute border border-[#e0e2d9] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <AutoLayoutHorizontal4 />
    </div>
  );
}

function AutoLayoutHorizontal6() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[12px] items-start leading-[0] not-italic overflow-clip relative shrink-0 text-[14px] text-black text-nowrap" data-name="Auto Layout Horizontal">
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[21px] text-nowrap whitespace-pre">🎨</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[21px] text-nowrap whitespace-pre">Creative</p>
      </div>
    </div>
  );
}

function AutoLayoutHorizontal7() {
  return (
    <div className="absolute bg-white box-border content-stretch flex items-start left-[134.88px] pb-[9px] pl-[17px] pr-[16.297px] pt-[10px] rounded-[24px] top-[41px]" data-name="Auto Layout Horizontal">
      <div aria-hidden="true" className="absolute border border-[#e0e2d9] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <AutoLayoutHorizontal6 />
    </div>
  );
}

function AutoLayoutHorizontal8() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[12px] items-start leading-[0] not-italic overflow-clip relative shrink-0 text-[14px] text-black text-nowrap" data-name="Auto Layout Horizontal">
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[21px] text-nowrap whitespace-pre">📚</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[21px] text-nowrap whitespace-pre">Education</p>
      </div>
    </div>
  );
}

function AutoLayoutHorizontal9() {
  return (
    <div className="absolute bg-white box-border content-stretch flex items-start left-[258.17px] pb-[9px] pl-[17px] pr-[16.875px] pt-[10px] rounded-[24px] top-[41px]" data-name="Auto Layout Horizontal">
      <div aria-hidden="true" className="absolute border border-[#e0e2d9] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <AutoLayoutHorizontal8 />
    </div>
  );
}

function AutoLayoutHorizontal10() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[12px] items-start leading-[0] not-italic overflow-clip relative shrink-0 text-[14px] text-black text-nowrap" data-name="Auto Layout Horizontal">
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[21px] text-nowrap whitespace-pre">🎶</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[21px] text-nowrap whitespace-pre">Entertainment</p>
      </div>
    </div>
  );
}

function AutoLayoutHorizontal11() {
  return (
    <div className="absolute bg-white box-border content-stretch flex items-start left-[392.05px] pb-[9px] pl-[17px] pr-[16.531px] pt-[10px] rounded-[24px] top-[41px]" data-name="Auto Layout Horizontal">
      <div aria-hidden="true" className="absolute border border-[#e0e2d9] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <AutoLayoutHorizontal10 />
    </div>
  );
}

function AutoLayoutHorizontal12() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[12px] items-start leading-[0] not-italic overflow-clip relative shrink-0 text-[14px] text-black text-nowrap" data-name="Auto Layout Horizontal">
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[21px] text-nowrap whitespace-pre">👗</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[21px] text-nowrap whitespace-pre">{`Fashion & Beauty`}</p>
      </div>
    </div>
  );
}

function AutoLayoutHorizontal13() {
  return (
    <div className="absolute bg-white box-border content-stretch flex items-start left-[8px] pb-[9px] pl-[17px] pr-[16.578px] pt-[10px] rounded-[24px] top-[89px]" data-name="Auto Layout Horizontal">
      <div aria-hidden="true" className="absolute border border-[#e0e2d9] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <AutoLayoutHorizontal12 />
    </div>
  );
}

function AutoLayoutHorizontal14() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[12px] items-start leading-[0] not-italic overflow-clip relative shrink-0 text-[14px] text-black text-nowrap" data-name="Auto Layout Horizontal">
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[21px] text-nowrap whitespace-pre">🍕</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[21px] text-nowrap whitespace-pre">{`Food & Beverage`}</p>
      </div>
    </div>
  );
}

function AutoLayoutHorizontal15() {
  return (
    <div className="absolute bg-white box-border content-stretch flex items-start left-[190.58px] pb-[9px] pl-[17px] pr-[16.359px] pt-[10px] rounded-[24px] top-[89px]" data-name="Auto Layout Horizontal">
      <div aria-hidden="true" className="absolute border border-[#e0e2d9] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <AutoLayoutHorizontal14 />
    </div>
  );
}

function AutoLayoutHorizontal16() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[12px] items-start leading-[0] not-italic overflow-clip relative shrink-0 text-[14px] text-black text-nowrap" data-name="Auto Layout Horizontal">
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[21px] text-nowrap whitespace-pre">⚖️</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[21px] text-nowrap whitespace-pre">{`Government & Politics`}</p>
      </div>
    </div>
  );
}

function AutoLayoutHorizontal17() {
  return (
    <div className="absolute bg-white box-border content-stretch flex items-start left-[370.94px] pb-[9px] pl-[17px] pr-[16.344px] pt-[10px] rounded-[24px] top-[89px]" data-name="Auto Layout Horizontal">
      <div aria-hidden="true" className="absolute border border-[#e0e2d9] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <AutoLayoutHorizontal16 />
    </div>
  );
}

function AutoLayoutHorizontal18() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[12px] items-start leading-[0] not-italic overflow-clip relative shrink-0 text-[14px] text-black text-nowrap" data-name="Auto Layout Horizontal">
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[21px] text-nowrap whitespace-pre">🍎</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[21px] text-nowrap whitespace-pre">{`Health & Wellness`}</p>
      </div>
    </div>
  );
}

function AutoLayoutHorizontal19() {
  return (
    <div className="absolute bg-white box-border content-stretch flex items-start left-[8px] pb-[9px] pl-[17px] pr-[16.438px] pt-[10px] rounded-[24px] top-[137px]" data-name="Auto Layout Horizontal">
      <div aria-hidden="true" className="absolute border border-[#e0e2d9] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <AutoLayoutHorizontal18 />
    </div>
  );
}

function AutoLayoutHorizontal20() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[12px] items-start leading-[0] not-italic overflow-clip relative shrink-0 text-[14px] text-black text-nowrap" data-name="Auto Layout Horizontal">
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[21px] text-nowrap whitespace-pre">💗</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[21px] text-nowrap whitespace-pre">Non-Profit</p>
      </div>
    </div>
  );
}

function AutoLayoutHorizontal21() {
  return (
    <div className="absolute bg-white box-border content-stretch flex items-start left-[194.44px] pb-[9px] pl-[17px] pr-[16.219px] pt-[10px] rounded-[24px] top-[137px]" data-name="Auto Layout Horizontal">
      <div aria-hidden="true" className="absolute border border-[#e0e2d9] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <AutoLayoutHorizontal20 />
    </div>
  );
}

function AutoLayoutHorizontal22() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[12px] items-start leading-[0] not-italic overflow-clip relative shrink-0 text-[14px] text-black text-nowrap" data-name="Auto Layout Horizontal">
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[21px] text-nowrap whitespace-pre">💗</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[21px] text-nowrap whitespace-pre">Other</p>
      </div>
    </div>
  );
}

function AutoLayoutHorizontal23() {
  return (
    <div className="absolute bg-white box-border content-stretch flex items-start left-[331.66px] pb-[9px] pl-[17px] pr-[16.547px] pt-[10px] rounded-[24px] top-[137px]" data-name="Auto Layout Horizontal">
      <div aria-hidden="true" className="absolute border border-[#e0e2d9] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <AutoLayoutHorizontal22 />
    </div>
  );
}

function AutoLayoutHorizontal24() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[12px] items-start leading-[0] not-italic overflow-clip relative shrink-0 text-[14px] text-black text-nowrap" data-name="Auto Layout Horizontal">
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[21px] text-nowrap whitespace-pre">🖥</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0">
        <p className="leading-[21px] text-nowrap whitespace-pre">Tech</p>
      </div>
    </div>
  );
}

function AutoLayoutHorizontal25() {
  return (
    <div className="absolute bg-white box-border content-stretch flex items-start left-[437.2px] pb-[9px] pl-[17px] pr-[16.125px] pt-[10px] rounded-[24px] top-[137px]" data-name="Auto Layout Horizontal">
      <div aria-hidden="true" className="absolute border border-[#e0e2d9] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <AutoLayoutHorizontal24 />
    </div>
  );
}

function AutoLayoutHorizontal26() {
  return (
    <div className="content-stretch flex font-['Inter:Regular',sans-serif] font-normal gap-[8.641px] items-start leading-[0] not-italic overflow-clip relative shrink-0 text-black text-nowrap" data-name="Auto Layout Horizontal">
      <div className="flex flex-col justify-center relative shrink-0 text-[13px]">
        <p className="leading-[21px] text-nowrap whitespace-pre">✈️</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[14px]">
        <p className="leading-[21px] text-nowrap whitespace-pre">{`Travel & Tourism`}</p>
      </div>
    </div>
  );
}

function AutoLayoutHorizontal27() {
  return (
    <div className="absolute bg-white box-border content-stretch flex items-start left-[8px] pb-[9px] pl-[17px] pr-[16.219px] pt-[10px] rounded-[24px] top-[185px]" data-name="Auto Layout Horizontal">
      <div aria-hidden="true" className="absolute border border-[#e0e2d9] border-solid inset-0 pointer-events-none rounded-[24px]" />
      <AutoLayoutHorizontal26 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="h-[225px] relative shrink-0 w-[600px]" data-name="Frame">
      <div className="absolute flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] left-[12px] not-italic text-[14px] text-black text-nowrap top-[10.5px] translate-y-[-50%]">
        <p className="leading-[21px] whitespace-pre">Select one category that best describes your Linktree:</p>
      </div>
      <AutoLayoutHorizontal5 />
      <AutoLayoutHorizontal7 />
      <AutoLayoutHorizontal9 />
      <AutoLayoutHorizontal11 />
      <AutoLayoutHorizontal13 />
      <AutoLayoutHorizontal15 />
      <AutoLayoutHorizontal17 />
      <AutoLayoutHorizontal19 />
      <AutoLayoutHorizontal21 />
      <AutoLayoutHorizontal23 />
      <AutoLayoutHorizontal25 />
      <AutoLayoutHorizontal27 />
    </div>
  );
}

function AutoLayoutHorizontal28() {
  return (
    <div className="bg-[#8129d9] box-border content-stretch flex items-start pl-[261.969px] pr-[261.031px] py-[12px] relative rounded-[64px] shrink-0" data-name="Auto Layout Horizontal">
      <div className="flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-nowrap text-white tracking-[-0.32px]">
        <p className="leading-[24px] whitespace-pre">Continue</p>
      </div>
    </div>
  );
}

function AutoLayoutVertical() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[48px] items-end left-[-8px] top-[145.59px]" data-name="Auto Layout Vertical">
      <AutoLayoutHorizontal3 />
      <Frame3 />
      <AutoLayoutHorizontal28 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute h-[566.594px] left-[174.33px] top-[144px] w-[592px]" data-name="Frame">
      <div className="absolute flex flex-col font-['Inter:Extra_Bold',sans-serif] font-extrabold h-[59px] justify-center leading-[0] left-0 not-italic text-[48px] text-black top-[28.5px] tracking-[-2px] translate-y-[-50%] w-[467.328px]">
        <p className="leading-[57.6px]">Tell us about yourself</p>
      </div>
      <div className="absolute flex flex-col font-['Inter:Regular',sans-serif] font-normal h-[20px] justify-center leading-[0] left-0 not-italic text-[#676b5f] text-[16px] top-[85.59px] tracking-[-0.32px] translate-y-[-50%] w-[280.572px]">
        <p className="leading-[24px]">For a personalized Linktree experience</p>
      </div>
      <AutoLayoutVertical />
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute h-[24px] left-1/2 top-0 translate-x-[-50%] w-[112.938px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 113 24">
        <g id="Frame">
          <path d={svgPaths.p3b866300} fill="var(--fill-0, black)" id="Vector" />
          <path d={svgPaths.p895a00} fill="var(--fill-0, #43E660)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute h-[24px] left-[48px] overflow-clip top-[48px] w-[112.938px]" data-name="Frame">
      <Frame5 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute h-[782.594px] left-0 top-0 w-[1411px]" data-name="Frame">
      <Frame1 />
      <Frame4 />
      <Frame6 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="absolute bg-white h-[782.594px] left-0 top-0 w-[1411px]" data-name="Frame">
      <Frame7 />
    </div>
  );
}

function Frame9() {
  return <div className="absolute bg-[rgba(255,255,255,0)] h-[60px] left-[1341px] rounded-[2px] shadow-[0px_0px_5px_0px_#808080] top-[620px] w-[256px]" data-name="Frame" />;
}

export default function Component() {
  return (
    <div className="relative size-full" data-name="122-10">
      <Frame8 />
      <Frame9 />
    </div>
  );
}