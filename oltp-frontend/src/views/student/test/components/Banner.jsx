import nft1 from "assets/img/nfts/NftBanner1.png";
import logo from "assets/img/Logo/correct.png";

const Banner1 = () => {
  return (
    <div
      className="flex w-full flex-col rounded-[20px] bg-cover px-[30px] py-[30px] md:px-[64px] md:py-[56px]"
      style={{ backgroundImage: `url(${nft1})` }}
    >
      <div className="flex w-full items-center justify-between">
        <div className="w-full">
          <h4 className="mb-[14px] max-w-full text-xl font-bold text-white md:w-[64%] md:text-3xl md:leading-[42px]">
            Correct Steps
          </h4>
          <p className="mb-[40px] max-w-full text-base font-medium text-[#E3DAFF] md:w-[64%] lg:w-[40%] xl:w-[72%] 2xl:w-[60%] 3xl:w-[45%]">
            {/* - Chinese proverb */}
          </p>
        </div>
        <img
          src={logo}
          alt="Correct Steps Logo"
          className="h-[100px] w-auto"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>
    </div>
  );
};

export default Banner1;
 
// update: 2026-03-19