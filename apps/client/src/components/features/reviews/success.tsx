const SuccessComponent = (props: { rating: number; show: boolean }) => {
  if (!props.show) return null;

  return (
    <div className="p-8 text-center">
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center mx-auto mb-4 shadow-inner">
        <span className="text-3xl">🙏</span>
      </div>
      <h3 className="text-xl font-black text-[#301118] mb-2">Dhanyavaad!</h3>
      <p className="text-sm text-gray-400 font-medium leading-relaxed">
        Aapka review humein aur behtar banane mein madad karta hai.
        <br />
        Shukriya for being a part of our family! 💫
      </p>
      <div className="mt-5 flex items-center justify-center gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <span
            key={s}
            className={`text-2xl ${s <= props.rating ? "text-orange-400" : "text-gray-200"}`}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
};

export default SuccessComponent;
