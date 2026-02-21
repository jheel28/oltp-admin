import nft1 from "assets/img/nfts/NftBanner1.png";
import Logo from "assets/img/Logo/correct.png";
const Banner1 = () => {
  return (
    <div
      className="flex w-full flex-col rounded-[20px] bg-cover px-[30px] py-[30px] md:px-[64px] md:py-[56px]"
      style={{ backgroundImage: `url(${nft1})` }}
    >
      <div className="flex w-full items-center justify-between">
        <h4 className="mb-[14px] max-w-full text-xl font-bold text-white md:w-[64%] md:text-3xl md:leading-[42px] lg:w-[46%] xl:w-[85%] 2xl:w-[75%] 3xl:w-[52%]">
          The Correct Steps
        </h4>
        &nbsp;&nbsp;
        <div className="flex h-[110px] w-[110px] items-center justify-center rounded-full bg-white border-[4px] border-white/30 p-3 shadow-2xl md:h-[140px] md:w-[140px]">
          <img
            src={Logo}
            alt="The Correct Steps logo"
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner1;
